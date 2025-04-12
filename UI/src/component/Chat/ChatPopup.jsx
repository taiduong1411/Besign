import { useState, useEffect, useRef, useContext } from "react";
import { FaTimes, FaAngleDown, FaAngleUp } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { getItems, addItems } from "../../utils/service";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { UserContext } from "../../context/UserContext";

// Sound effect for new messages
const NEW_MESSAGE_SOUND = new Audio("/notification.mp3");

const ChatPopup = ({ initialSeller, onClose }) => {
  const { userData } = useContext(UserContext);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const intervalRef = useRef(null);
  const [sellerInfo, setSellerInfo] = useState(null);

  // Lấy thông tin người bán từ email
  useEffect(() => {
    const fetchSellerInfo = async () => {
      if (!initialSeller) return;

      try {
        // Gọi API để lấy thông tin người bán từ email
        const response = await getItems(`accounts/by-email/${initialSeller}`);
        if (response && response.data) {
          setSellerInfo(response.data);
        }
      } catch (error) {
        console.error("Error fetching seller info:", error);
        toast.error("Không thể tải thông tin người bán");
      }
    };

    fetchSellerInfo();
  }, [initialSeller]);

  // Tìm hoặc tạo chat với người bán
  useEffect(() => {
    const findOrCreateChat = async () => {
      if (!sellerInfo || !userData) return;

      try {
        setIsLoading(true);
        setError(null);
        // Tìm chat đã có với người bán
        const chatsResponse = await getItems("chat/user/chats");

        if (chatsResponse && chatsResponse.data) {
          const existingChat = chatsResponse.data.find((chat) => {
            return chat.participants.some((p) => p.email === initialSeller);
          });

          if (existingChat) {
            console.log("Found existing chat:", existingChat);
            setSelectedChat(existingChat);
            fetchMessages(existingChat._id);
          } else {
            // Tạo chat mới với người bán
            console.log("Creating new chat with seller:", initialSeller);
            const newChatResponse = await addItems("chat/add-chat", {
              sellerEmail: initialSeller,
            });

            console.log("New chat response:", newChatResponse);
            if (newChatResponse && newChatResponse.data) {
              setSelectedChat(newChatResponse.data);
              setMessages([]);
            } else if (newChatResponse && newChatResponse.error) {
              console.error("Error creating chat:", newChatResponse.error);
              setError(
                "Không thể tạo cuộc trò chuyện: " +
                  (typeof newChatResponse.error === "object"
                    ? JSON.stringify(newChatResponse.error)
                    : newChatResponse.error)
              );
              toast.error("Không thể tạo cuộc trò chuyện mới");
            }
          }
        }
      } catch (error) {
        console.error("Error finding or creating chat:", error);
        setError("Không thể kết nối với người bán. Vui lòng thử lại sau.");
        toast.error("Không thể kết nối với người bán");
      } finally {
        setIsLoading(false);
      }
    };

    if (sellerInfo && userData) {
      findOrCreateChat();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [sellerInfo, userData, initialSeller]);

  // Thiết lập interval để kiểm tra tin nhắn mới
  useEffect(() => {
    if (selectedChat && !isMinimized) {
      // Khởi động interval kiểm tra tin nhắn mới mỗi 5 giây
      intervalRef.current = setInterval(() => {
        checkNewMessages();
      }, 60000);

      // Đảm bảo interval được xóa khi component unmount
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [selectedChat, isMinimized]);

  // Dừng kiểm tra tin nhắn mới khi thu nhỏ
  useEffect(() => {
    if (isMinimized && intervalRef.current) {
      clearInterval(intervalRef.current);
    } else if (!isMinimized && selectedChat) {
      // Khởi động lại khi mở lại
      intervalRef.current = setInterval(() => {
        checkNewMessages();
      }, 60000);
    }
  }, [isMinimized]);

  // Kiểm tra tin nhắn mới
  const checkNewMessages = async () => {
    if (!selectedChat) return;

    try {
      const response = await getItems(`chat/${selectedChat._id}/messages`);

      if (response && response.data && response.data.messages) {
        const newMessages = response.data.messages;

        // Nếu có tin nhắn mới
        if (newMessages.length > messages.length) {
          // Tìm các tin nhắn mới (những tin không có trong danh sách hiện tại)
          const currentIds = messages.map((m) => m._id);
          const newestMessages = newMessages.filter(
            (m) => !currentIds.includes(m._id)
          );

          // Có tin nhắn mới không phải từ người dùng hiện tại
          const hasNewFromOthers = newestMessages.some(
            (m) => m.sender !== userData._id
          );

          if (hasNewFromOthers && !isMinimized) {
            // Phát âm thanh thông báo
            try {
              NEW_MESSAGE_SOUND.play();
            } catch (err) {
              console.log("Không thể phát âm thanh thông báo");
            }
          }

          // Cập nhật tin nhắn và cuộn xuống
          setMessages(newMessages);
          scrollToBottom();

          // Đánh dấu đã đọc nếu chat đang mở
          if (!isMinimized) {
            await addItems(
              `chat/${selectedChat._id}/read`,
              {},
              { method: "PUT" }
            );
          } else {
            // Cập nhật số tin nhắn chưa đọc nếu đang thu nhỏ
            setUnreadCount(
              (prev) =>
                prev +
                newestMessages.filter(
                  (m) => m.sender !== userData._id && !m.read
                ).length
            );
          }
        }
      }
    } catch (error) {
      console.error("Error checking new messages:", error);
    }
  };

  // Lấy tin nhắn khi đã có chatId
  const fetchMessages = async (chatId) => {
    try {
      setError(null);
      const response = await getItems(`chat/${chatId}/messages`);

      if (response && response.data) {
        setMessages(response.data.messages || []);
        scrollToBottom();

        // Đánh dấu tin nhắn đã đọc
        if (!isMinimized) {
          await addItems(`chat/${chatId}/read`, {}, { method: "PUT" });
          setUnreadCount(0);
        } else {
          // Đếm số tin nhắn chưa đọc
          const unread = (response.data.messages || []).filter(
            (m) => m.sender !== userData._id && !m.read
          ).length;
          setUnreadCount(unread);
        }
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError("Không thể tải tin nhắn. Vui lòng thử lại sau.");
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || isSending) return;

    try {
      setIsSending(true);
      setError(null);

      console.log(`Sending message to chat ${selectedChat._id}:`, newMessage);

      // Sử dụng addItems thay vì getItems với các tham số method và data
      const response = await addItems(`chat/${selectedChat._id}/messages`, {
        content: newMessage,
      });

      console.log("Send message response:", response);

      if (response && response.data) {
        // Thêm tin nhắn mới vào danh sách
        setMessages((prevMessages) => [...prevMessages, response.data]);
        setNewMessage("");
        scrollToBottom();
      } else if (response && response.error) {
        console.error("Error in send message response:", response.error);
        setError(
          "Không thể gửi tin nhắn: " +
            (typeof response.error === "object"
              ? JSON.stringify(response.error)
              : response.error)
        );
        toast.error("Lỗi khi gửi tin nhắn");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Không thể gửi tin nhắn. Vui lòng thử lại sau.");
      toast.error("Lỗi khi gửi tin nhắn");
    } finally {
      setIsSending(false);
    }
  };

  // Xử lý tải ảnh
  // const handleImageUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   // Chỉ cho phép định dạng ảnh
  //   if (!file.type.match("image.*")) {
  //     toast.error("Vui lòng chỉ tải lên các tệp hình ảnh");
  //     return;
  //   }

  //   // Giới hạn kích thước file (5MB)
  //   if (file.size > 5 * 1024 * 1024) {
  //     toast.error("Hình ảnh không được vượt quá 5MB");
  //     return;
  //   }

  //   toast.info("Tính năng tải ảnh đang được phát triển");
  //   // TODO: Implement image upload in future versions
  // };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleMinimize = () => {
    const newState = !isMinimized;
    setIsMinimized(newState);

    // Nếu mở lại chat, đánh dấu tin nhắn đã đọc và reset số lượng
    if (!newState && selectedChat && unreadCount > 0) {
      addItems(`chat/${selectedChat._id}/read`, {}, { method: "PUT" })
        .then(() => {
          setUnreadCount(0);
          // Cập nhật lại tin nhắn
          fetchMessages(selectedChat._id);
        })
        .catch((err) => {
          console.error("Error marking messages as read:", err);
        });
    }
  };

  const getRelativeTime = (messageTime) => {
    const now = new Date();
    const time = new Date(messageTime);
    const diffInHours = (now - time) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return format(time, "HH:mm", { locale: vi });
    } else if (diffInHours < 48) {
      return "Hôm qua " + format(time, "HH:mm", { locale: vi });
    } else {
      return format(time, "dd/MM/yyyy HH:mm", { locale: vi });
    }
  };

  if (!userData) {
    return null;
  }

  const sellerName =
    sellerInfo?.fullname || initialSeller?.split("@")[0] || "Người bán";

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col rounded-lg shadow-xl w-80 bg-white overflow-hidden">
      {/* Chat Header */}
      <div className="bg-blue-600 text-white p-3 flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative">
            <img
              src={sellerInfo?.avatar || "/default-avatar.png"}
              alt="Seller"
              className="w-8 h-8 rounded-full mr-2 object-cover"
            />
          </div>
          <div>
            <div className="font-medium">{sellerName}</div>
          </div>
        </div>
        <div className="flex items-center">
          {isMinimized ? (
            <button
              onClick={toggleMinimize}
              className="relative p-1 text-white hover:bg-blue-700 rounded-full mr-1">
              <FaAngleUp />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          ) : (
            <button
              onClick={toggleMinimize}
              className="p-1 text-white hover:bg-blue-700 rounded-full mr-1">
              <FaAngleDown />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-white hover:bg-blue-700 rounded-full">
            <FaTimes />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="h-80 p-3 overflow-y-auto bg-gray-100">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="flex flex-col justify-center items-center h-full text-gray-500">
                <p className="text-sm text-red-500 mb-2">{error}</p>
                <button
                  onClick={() =>
                    selectedChat && fetchMessages(selectedChat._id)
                  }
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
                  Thử lại
                </button>
              </div>
            ) : messages.length > 0 ? (
              messages.map((message, index) => {
                const isMine = message.sender === userData._id;
                const showAvatar =
                  !isMine &&
                  (index === 0 ||
                    messages[index - 1].sender !== message.sender);

                return (
                  <div
                    key={index}
                    className={`mb-3 flex ${
                      isMine ? "justify-end" : "justify-start"
                    }`}>
                    {!isMine && showAvatar && (
                      <img
                        src={sellerInfo?.avatar || "/default-avatar.png"}
                        alt="Seller"
                        className="w-6 h-6 rounded-full mr-1 mt-1 object-cover"
                      />
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg p-2 ${
                        isMine
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-800 border border-gray-200"
                      }`}>
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <div className="flex items-center justify-end mt-1">
                        <span className="text-xs opacity-70">
                          {getRelativeTime(message.timestamp)}
                        </span>
                        {message.read && isMine && (
                          <span className="text-xs opacity-70 ml-1">✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                Bắt đầu cuộc trò chuyện với {sellerName}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-2 border-t flex items-center">
            {/* <input
              type="file"
              id="imageUpload"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
            <label
              htmlFor="imageUpload"
              className="p-2 text-gray-500 hover:text-gray-700 cursor-pointer">
              <FaImage size={18} />
            </label> */}
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn..."
              rows="1"
              className="flex-1 mx-2 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none max-h-24"
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isSending}
              className={`p-2 rounded-full ${
                newMessage.trim() && !isSending
                  ? "text-blue-500 hover:text-blue-600"
                  : "text-gray-400"
              }`}>
              {isSending ? (
                <div className="w-5 h-5 border-2 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
              ) : (
                <IoMdSend size={20} />
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

ChatPopup.propTypes = {
  initialSeller: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ChatPopup;
