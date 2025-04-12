import { useState, useEffect, useRef, useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import {
  Layout,
  Typography,
  List,
  Avatar,
  Input,
  Button,
  Spin,
  Badge,
  Empty,
  Tooltip,
  Card,
  Tag,
} from "antd";
import StickyBox from "react-sticky-box";
import SideBar from "../../../component/SideBar/SideBarSeller";
import {
  SendOutlined,
  SearchOutlined,
  UserOutlined,
  MessageOutlined,
  BellOutlined,
  ReloadOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  CommentOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { getItems, addItems } from "../../../utils/service";
import { toast } from "react-toastify";
import { theme } from "antd";

const { Content, Header } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;
const { Search } = Input;

// Sound effect for new messages
const MESSAGE_SOUND = new Audio("/notification.mp3");

function CustomerChat() {
  const { userData } = useContext(UserContext);
  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messageEndRef = useRef(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Lấy danh sách chat
  useEffect(() => {
    if (userData && userData._id) {
      fetchChatList();

      // Thiết lập cập nhật tự động mỗi 10 giây
      const interval = setInterval(() => {
        refreshData();
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [userData]);

  // Cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Hàm refresh dữ liệu
  const refreshData = async () => {
    // Chỉ refresh danh sách chat nếu không đang loading
    if (!loading) {
      const response = await getItems("chat/user/chats");

      if (response && response.data) {
        // So sánh số lượng tin nhắn mới
        const newChats = response.data;

        newChats.forEach((newChat) => {
          const existingChat = chatList.find(
            (chat) => chat._id === newChat._id
          );

          if (
            existingChat &&
            newChat.messages.length > existingChat.messages.length
          ) {
            // Kiểm tra xem tin nhắn mới có phải từ người dùng khác không
            const newMessages = newChat.messages.slice(
              existingChat.messages.length
            );
            const hasNewMessageFromOthers = newMessages.some(
              (msg) => msg.sender !== userData._id
            );

            if (hasNewMessageFromOthers) {
              try {
                MESSAGE_SOUND.play();
              } catch (error) {
                console.log("Không thể phát âm thanh", error);
              }
            }
          }
        });

        // Cập nhật danh sách
        setChatList(newChats);

        // Nếu đang có chat được chọn, cập nhật tin nhắn
        if (selectedChat) {
          const updatedChat = newChats.find(
            (chat) => chat._id === selectedChat._id
          );
          if (updatedChat) {
            setSelectedChat(updatedChat);
            fetchMessages(updatedChat._id);
          }
        }
      }
    }
  };

  // Lấy danh sách chat
  const fetchChatList = async () => {
    try {
      setLoading(true);
      const response = await getItems("chat/user/chats");

      if (response && response.data) {
        console.log("Chat list:", response.data);
        setChatList(response.data);

        // Tính số tin nhắn chưa đọc cho mỗi chat
        const counts = {};
        response.data.forEach((chat) => {
          const count = chat.messages.filter(
            (msg) => !msg.read && msg.sender !== userData._id
          ).length;
          counts[chat._id] = count;
        });
        setUnreadCounts(counts);

        // Chọn chat đầu tiên nếu có
        if (response.data.length > 0 && !selectedChat) {
          setSelectedChat(response.data[0]);
          fetchMessages(response.data[0]._id);
        }
      }
    } catch (error) {
      console.error("Error fetching chat list:", error);
      toast.error("Không thể tải danh sách chat");
    } finally {
      setLoading(false);
    }
  };

  // Lấy tin nhắn của chat
  const fetchMessages = async (chatId) => {
    try {
      setLoading(true);
      const response = await getItems(`chat/${chatId}/messages`);

      if (response && response.data) {
        console.log("Messages:", response.data.messages);
        setMessages(response.data.messages || []);

        // Đánh dấu tin nhắn đã đọc
        if (unreadCounts[chatId] > 0) {
          await addItems(`chat/${chatId}/read`, {}, { method: "PUT" });
          setUnreadCounts((prev) => ({ ...prev, [chatId]: 0 }));
        }
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Không thể tải tin nhắn");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý chọn chat
  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    fetchMessages(chat._id);
  };

  // Xử lý gửi tin nhắn
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || sendingMessage) return;

    try {
      setSendingMessage(true);
      const response = await addItems(`chat/${selectedChat._id}/messages`, {
        content: newMessage,
      });

      if (response && response.data) {
        setMessages((prev) => [...prev, response.data]);
        setNewMessage("");
        // Cập nhật lastMessage của chat
        setChatList((prev) =>
          prev.map((chat) =>
            chat._id === selectedChat._id
              ? {
                  ...chat,
                  lastMessage: newMessage,
                  lastMessageTime: new Date(),
                }
              : chat
          )
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Không thể gửi tin nhắn");
    } finally {
      setSendingMessage(false);
    }
  };

  // Lọc chat theo từ khóa
  const filteredChatList = chatList.filter((chat) => {
    const usernames = chat.participants
      .map((p) => p.fullname || p.email.split("@")[0])
      .join(" ");

    return (
      usernames.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (chat.lastMessage &&
        chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Lấy tên và avatar của người dùng (không phải seller)
  const getBuyerInfo = (chat) => {
    if (!chat || !chat.participants)
      return { name: "Người dùng", avatar: null };

    const buyer = chat.participants.find((p) => p._id !== userData._id);
    return {
      name: buyer?.fullname || buyer?.email?.split("@")[0] || "Người dùng",
      avatar: buyer?.avatar || null,
    };
  };

  // Format time
  const formatTime = (time) => {
    const date = new Date(time);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return format(date, "HH:mm", { locale: vi });
    } else if (diffInHours < 48) {
      return "Hôm qua " + format(date, "HH:mm", { locale: vi });
    } else {
      return format(date, "dd/MM/yyyy", { locale: vi });
    }
  };

  // Stats
  const totalChats = chatList.length;
  const totalUnreadChats = Object.values(unreadCounts).filter(
    (count) => count > 0
  ).length;
  const totalUnreadMessages = Object.values(unreadCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  return (
    <div className="bg-[#f5f8ff] min-h-screen">
      <div className="flex">
        <div className="">
          <StickyBox>
            <SideBar
              props={3}
              collapsed={collapsed}
              onCollapse={setCollapsed}
            />
          </StickyBox>
        </div>
        <div className="w-full">
          <Layout className="min-h-svh">
            <Header
              style={{
                padding: 0,
                paddingTop: "12px",
                paddingBottom: "12px",
                background: colorBgContainer,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                position: "sticky",
                top: 0,
                zIndex: 1,
                width: "100%",
              }}>
              <div className="flex justify-between items-center px-6">
                <div className="flex items-center gap-3">
                  <Button
                    type="text"
                    icon={
                      collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                    }
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                      fontSize: "16px",
                      width: 42,
                      height: 42,
                    }}
                    className="flex items-center justify-center hover:bg-blue-50 hover:text-blue-500"
                  />
                  <div className="hidden md:block">
                    <Title level={4} className="m-0 flex items-center gap-2">
                      <DashboardOutlined className="text-blue-500" />
                      <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent font-bold">
                        BeSign Seller
                      </span>
                    </Title>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Tooltip title="Làm mới">
                    <Button
                      type="text"
                      shape="circle"
                      icon={<ReloadOutlined />}
                      onClick={() => fetchChatList()}
                      className="flex items-center justify-center hover:bg-blue-50 hover:text-blue-500 text-gray-500"
                    />
                  </Tooltip>

                  <Tooltip title="Thông báo">
                    <Badge
                      count={totalUnreadMessages}
                      size="small"
                      className="pulse-badge">
                      <Button
                        type="text"
                        shape="circle"
                        icon={<BellOutlined />}
                        className="flex items-center justify-center hover:bg-blue-50 hover:text-blue-500 text-gray-500"
                      />
                    </Badge>
                  </Tooltip>

                  <div className="flex items-center border-l border-gray-200 pl-4 ml-2">
                    <Avatar
                      size={36}
                      src="https://i.pravatar.cc/150?img=3"
                      className="border-2 border-white shadow-sm"
                    />
                    <div className="ml-3 hidden md:block">
                      <Text
                        strong
                        className="text-gray-800 block leading-tight">
                        Seller
                      </Text>
                      <Text className="text-xs text-gray-500 block leading-tight">
                        Trang người bán
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            </Header>

            <Content className="m-6 p-0">
              {/* Page title with breadcrumb */}
              <div className="mb-6">
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                  <a
                    href="/seller/dashboard"
                    className="hover:text-blue-500 transition-colors">
                    Dashboard
                  </a>
                  <span className="px-1">/</span>
                  <span className="text-gray-700">Quản lý tin nhắn</span>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <Title
                      level={3}
                      className="!m-0 !text-gray-800 flex items-center gap-2">
                      <MessageOutlined className="text-blue-500" />
                      Quản Lý Tin Nhắn
                      <Badge
                        count={totalChats}
                        style={{
                          backgroundColor: "#3b82f6",
                          marginLeft: "8px",
                        }}
                        className="ml-2"
                      />
                    </Title>
                    <Text type="secondary">
                      Quản lý và phản hồi tin nhắn từ khách hàng
                    </Text>
                  </div>
                </div>
              </div>

              {/* Analytics cards with animation */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card
                  className="card-stats shadow-md hover:shadow-lg transition-shadow rounded-xl border-none overflow-hidden"
                  bodyStyle={{ padding: "0" }}>
                  <div className="p-6 relative">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 opacity-10 rounded-full -mr-8 -mt-8"></div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-500">
                        <CommentOutlined style={{ fontSize: "24px" }} />
                      </div>
                      <div>
                        <Text className="text-gray-500 text-sm">
                          Tổng cuộc trò chuyện
                        </Text>
                        <Title level={3} className="!m-0">
                          {totalChats}
                        </Title>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card
                  className="card-stats shadow-md hover:shadow-lg transition-shadow rounded-xl border-none overflow-hidden"
                  bodyStyle={{ padding: "0" }}>
                  <div className="p-6 relative">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-500 opacity-10 rounded-full -mr-8 -mt-8"></div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-500">
                        <TeamOutlined style={{ fontSize: "24px" }} />
                      </div>
                      <div>
                        <Text className="text-gray-500 text-sm">
                          Người dùng nhắn tin
                        </Text>
                        <Title level={3} className="!m-0">
                          {chatList.length}
                        </Title>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card
                  className="card-stats shadow-md hover:shadow-lg transition-shadow rounded-xl border-none overflow-hidden"
                  bodyStyle={{ padding: "0" }}>
                  <div className="p-6 relative">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500 opacity-10 rounded-full -mr-8 -mt-8"></div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-500">
                        <MessageOutlined style={{ fontSize: "24px" }} />
                      </div>
                      <div>
                        <Text className="text-gray-500 text-sm">Chưa đọc</Text>
                        <Title level={3} className="!m-0">
                          {totalUnreadMessages}
                        </Title>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="shadow-md rounded-xl border-none mb-6">
                <div className="flex flex-col md:flex-row h-[calc(100vh-420px)] bg-white">
                  {/* Danh sách chat */}
                  <div className="w-full md:w-1/3 border-r border-gray-200 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-200">
                      <Search
                        placeholder="Tìm kiếm cuộc trò chuyện..."
                        allowClear
                        enterButton={
                          <Button
                            type="primary"
                            className="bg-blue-500 hover:bg-blue-600 border-blue-500">
                            <SearchOutlined className="text-white" />
                          </Button>
                        }
                        size="middle"
                        className="w-full news-search"
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    <div className="overflow-y-auto flex-grow custom-scrollbar">
                      {loading && !chatList.length ? (
                        <div className="flex justify-center items-center h-full">
                          <Spin />
                        </div>
                      ) : filteredChatList.length > 0 ? (
                        <List
                          dataSource={filteredChatList}
                          renderItem={(chat) => {
                            const buyerInfo = getBuyerInfo(chat);
                            const isSelected =
                              selectedChat && selectedChat._id === chat._id;
                            const hasUnread = unreadCounts[chat._id] > 0;

                            return (
                              <List.Item
                                onClick={() => handleSelectChat(chat)}
                                className={`cursor-pointer hover:bg-gray-50 transition-colors py-3 px-4 border-b border-gray-100 ${
                                  isSelected ? "bg-blue-50" : ""
                                }`}>
                                <div className="flex w-full">
                                  <Badge
                                    count={unreadCounts[chat._id] || 0}
                                    size="small">
                                    <Avatar
                                      src={buyerInfo.avatar}
                                      icon={
                                        !buyerInfo.avatar && <UserOutlined />
                                      }
                                      size={46}
                                      className="mr-3 flex-shrink-0"
                                    />
                                  </Badge>
                                  <div className="flex flex-col flex-grow min-w-0">
                                    <div className="flex justify-between items-center">
                                      <span
                                        className={`font-medium text-gray-800 truncate ${
                                          hasUnread
                                            ? "font-semibold text-black"
                                            : ""
                                        }`}>
                                        {buyerInfo.name}
                                      </span>
                                      <span className="text-xs text-gray-500 flex-shrink-0">
                                        {chat.lastMessageTime &&
                                          formatTime(chat.lastMessageTime)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between mt-1">
                                      <Text
                                        ellipsis
                                        className={`text-sm max-w-[180px] ${
                                          hasUnread
                                            ? "font-medium text-gray-800"
                                            : "text-gray-500"
                                        }`}>
                                        {chat.lastMessage ||
                                          "Bắt đầu cuộc trò chuyện"}
                                      </Text>
                                      {hasUnread && (
                                        <Badge
                                          count={unreadCounts[chat._id]}
                                          size="small"
                                          className="chat-badge"
                                        />
                                      )}
                                    </div>
                                    {chat.product && (
                                      <div className="mt-1">
                                        <Tag color="blue" className="text-xs">
                                          {chat.product.product_name}
                                        </Tag>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </List.Item>
                            );
                          }}
                        />
                      ) : (
                        <Empty
                          description="Không tìm thấy cuộc trò chuyện nào"
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          className="mt-10"
                        />
                      )}
                    </div>
                  </div>

                  {/* Tin nhắn */}
                  <div className="w-full md:w-2/3 flex flex-col">
                    {selectedChat ? (
                      <>
                        {/* Tiêu đề chat */}
                        <div className="p-4 border-b border-gray-200 flex items-center bg-white">
                          <Avatar
                            src={getBuyerInfo(selectedChat).avatar}
                            icon={
                              !getBuyerInfo(selectedChat).avatar && (
                                <UserOutlined />
                              )
                            }
                            size="large"
                            className="mr-3"
                          />
                          <div className="flex-grow">
                            <div className="flex justify-between items-center">
                              <Title level={5} className="m-0">
                                {getBuyerInfo(selectedChat).name}
                              </Title>
                              <Tag
                                color="blue"
                                className="ml-2 flex items-center">
                                <CheckCircleOutlined className="mr-1" /> Online
                              </Tag>
                            </div>
                            {selectedChat.product && (
                              <Text
                                type="secondary"
                                className="text-xs block mt-1">
                                Sản phẩm: {selectedChat.product.product_name}
                              </Text>
                            )}
                          </div>
                        </div>

                        {/* Nội dung chat */}
                        <div className="flex-grow p-6 overflow-y-auto bg-gray-50 custom-scrollbar">
                          {loading ? (
                            <div className="flex justify-center items-center h-full">
                              <Spin />
                            </div>
                          ) : messages.length > 0 ? (
                            <div className="space-y-4">
                              {messages.map((message, index) => {
                                const isMine = message.sender === userData._id;
                                const showAvatar =
                                  !isMine &&
                                  (index === 0 ||
                                    messages[index - 1].sender !==
                                      message.sender);
                                const prevMessageSameUser =
                                  index > 0 &&
                                  messages[index - 1].sender === message.sender;
                                const nextMessageSameUser =
                                  index < messages.length - 1 &&
                                  messages[index + 1].sender === message.sender;

                                return (
                                  <div
                                    key={index}
                                    className={`flex ${
                                      isMine ? "justify-end" : "justify-start"
                                    } ${
                                      prevMessageSameUser ? "mt-1" : "mt-4"
                                    }`}>
                                    {!isMine && showAvatar && (
                                      <div className="flex flex-col items-center mr-2">
                                        <Avatar
                                          src={
                                            getBuyerInfo(selectedChat).avatar
                                          }
                                          icon={
                                            !getBuyerInfo(selectedChat)
                                              .avatar && <UserOutlined />
                                          }
                                          size={36}
                                          className="flex-shrink-0"
                                        />
                                        {!nextMessageSameUser && (
                                          <Text className="text-xs text-gray-500 mt-1">
                                            {
                                              getBuyerInfo(
                                                selectedChat
                                              ).name.split(" ")[0]
                                            }
                                          </Text>
                                        )}
                                      </div>
                                    )}
                                    <div
                                      className={`max-w-[70%] group ${
                                        !isMine && !showAvatar
                                          ? "ml-[48px]"
                                          : ""
                                      }`}>
                                      <div
                                        className={`rounded-2xl py-2 px-4 shadow-sm
                                          ${
                                            isMine
                                              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                                              : "bg-white text-gray-800 border border-gray-100"
                                          }
                                          ${
                                            prevMessageSameUser && isMine
                                              ? "rounded-tr-sm"
                                              : ""
                                          }
                                          ${
                                            prevMessageSameUser && !isMine
                                              ? "rounded-tl-sm"
                                              : ""
                                          }
                                          ${
                                            nextMessageSameUser && isMine
                                              ? "rounded-br-sm"
                                              : ""
                                          }
                                          ${
                                            nextMessageSameUser && !isMine
                                              ? "rounded-bl-sm"
                                              : ""
                                          }
                                        `}>
                                        <div className="whitespace-pre-wrap break-words">
                                          {message.content}
                                        </div>
                                      </div>
                                      <div className="flex justify-end items-center mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Text
                                          className={`text-xs ${
                                            isMine
                                              ? "text-gray-500"
                                              : "text-gray-400"
                                          }`}>
                                          {formatTime(message.timestamp)}
                                        </Text>
                                        {isMine && message.read && (
                                          <Tooltip title="Đã đọc">
                                            <span className="text-xs text-blue-500 ml-1">
                                              ✓
                                            </span>
                                          </Tooltip>
                                        )}
                                      </div>
                                    </div>
                                    {isMine && showAvatar && (
                                      <div className="flex flex-col items-center ml-2">
                                        <Avatar
                                          src="https://i.pravatar.cc/150?img=3"
                                          size={36}
                                          className="flex-shrink-0"
                                        />
                                        {!nextMessageSameUser && (
                                          <Text className="text-xs text-gray-500 mt-1">
                                            Bạn
                                          </Text>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                              <div ref={messageEndRef} />
                            </div>
                          ) : (
                            <Empty
                              description="Không có tin nhắn nào. Bắt đầu cuộc trò chuyện!"
                              image={Empty.PRESENTED_IMAGE_SIMPLE}
                              className="my-10"
                            />
                          )}
                        </div>

                        {/* Nhập tin nhắn */}
                        <div className="p-4 border-t border-gray-200 flex items-end bg-white">
                          <div className="flex-grow relative">
                            <TextArea
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              placeholder="Nhập tin nhắn..."
                              autoSize={{ minRows: 1, maxRows: 4 }}
                              className="rounded-full border-gray-200 py-2 pr-12 resize-none"
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  handleSendMessage();
                                }
                              }}
                            />
                            <Button
                              type="primary"
                              shape="circle"
                              icon={
                                sendingMessage ? (
                                  <Spin size="small" />
                                ) : (
                                  <SendOutlined />
                                )
                              }
                              onClick={handleSendMessage}
                              disabled={!newMessage.trim() || sendingMessage}
                              className="absolute right-2 bottom-2 flex items-center justify-center"
                              size="middle"
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                          <MessageOutlined
                            style={{ fontSize: 48 }}
                            className="text-blue-300"
                          />
                        </div>
                        <Title level={4} className="text-gray-600 mb-2">
                          Tin nhắn của bạn
                        </Title>
                        <Text className="text-gray-500 max-w-md text-center mb-8">
                          Chọn một cuộc trò chuyện từ danh sách bên trái để bắt
                          đầu xem và phản hồi tin nhắn
                        </Text>
                        <Button
                          type="primary"
                          icon={<ReloadOutlined />}
                          onClick={() => fetchChatList()}
                          className="bg-blue-500">
                          Làm mới danh sách
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              <div className="text-center text-gray-500 text-xs mt-6 pb-6">
                <ClockCircleOutlined className="mr-1" />
                Cập nhật lần cuối: {new Date().toLocaleString("vi-VN")}
              </div>
            </Content>
          </Layout>
        </div>
      </div>

      {/* Custom CSS */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f5f5f5;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d9d9d9;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #bfbfbf;
        }

        .news-search .ant-input-affix-wrapper {
          border-radius: 8px 0 0 8px;
          border-right: none;
          border-color: #e5e7eb;
        }

        .news-search .ant-input-group-addon {
          background-color: #fff;
        }

        .news-search .ant-input-search-button {
          border-radius: 0 8px 8px 0 !important;
          overflow: hidden;
        }

        .card-stats {
          transition: all 0.3s ease;
        }

        .card-stats:hover {
          transform: translateY(-5px);
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
          }
          70% {
            box-shadow: 0 0 0 6px rgba(59, 130, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }

        .pulse-badge .ant-badge-count {
          animation: pulse 2s infinite;
        }

        .chat-badge .ant-badge-count {
          background-color: #4f46e5; 
        }

        .ant-textarea-textarea {
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}

export default CustomerChat;
