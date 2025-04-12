const Chat = require("../model/Chat");
const Account = require("../model/account");
const jwt = require("jsonwebtoken");

// Hàm giải mã token và lấy userId
const getUserIdFromToken = (req) => {
  try {
    const token = req.headers["authorization"];
    if (!token) return null;

    const decoded = jwt.decode(token);
    return decoded?._id;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

const ChatController = {
  // Lấy thông tin người dùng từ email
  getUserByEmail: async (req, res) => {
    try {
      const { email } = req.params;

      if (!email) {
        return res.status(400).json({ message: "Thiếu thông tin email" });
      }

      const user = await Account.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }

      // Chỉ trả về các thông tin công khai
      const publicUserInfo = {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        avatar: user.avatar,
      };

      res.status(200).json(publicUserInfo);
    } catch (error) {
      console.error("Error in getUserByEmail:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  },

  // Tạo chat mới hoặc lấy chat hiện có
  getOrCreateChat: async (req, res) => {
    try {
      const { sellerEmail } = req.body;
      console.log("Creating chat with:", { sellerEmail });

      if (!sellerEmail) {
        return res.status(400).json({ message: "Thiếu thông tin người bán" });
      }

      // Lấy thông tin người mua từ token
      const buyerId = getUserIdFromToken(req);
      if (!buyerId) {
        return res
          .status(401)
          .json({ message: "Vui lòng đăng nhập để sử dụng tính năng chat" });
      }

      // Tìm seller ID từ email
      const seller = await Account.findOne({ email: sellerEmail });
      if (!seller) {
        return res.status(404).json({ message: "Không tìm thấy người bán" });
      }

      const sellerId = seller._id;

      console.log("Found seller:", { sellerId, buyerId });

      // Kiểm tra xem đã có chat giữa buyer và seller chưa
      let chat = await Chat.findOne({
        participants: { $all: [buyerId, sellerId] },
      }).populate("participants", "fullname email avatar");

      // Nếu chưa có thì tạo mới
      if (!chat) {
        console.log("Creating new chat");
        chat = new Chat({
          participants: [buyerId, sellerId],
          messages: [],
        });
        await chat.save();
        chat = await chat.populate("participants", "fullname email avatar");
      }

      res.status(200).json(chat);
    } catch (error) {
      console.error("Error in getOrCreateChat:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  },

  // Gửi tin nhắn mới
  sendMessage: async (req, res) => {
    try {
      const { chatId } = req.params;
      const { content } = req.body;
      console.log("Sending message:", { chatId, content });

      // Lấy thông tin người gửi từ token
      const senderId = getUserIdFromToken(req);
      if (!senderId) {
        return res
          .status(401)
          .json({ message: "Vui lòng đăng nhập để gửi tin nhắn" });
      }

      const chat = await Chat.findById(chatId);
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }

      // Kiểm tra người gửi có phải là người tham gia chat không
      if (!chat.participants.includes(senderId)) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const newMessage = {
        sender: senderId,
        content,
        timestamp: new Date(),
        read: false,
      };

      chat.messages.push(newMessage);
      chat.lastMessage = content;
      chat.lastMessageTime = new Date();
      await chat.save();

      res.status(200).json(newMessage);
    } catch (error) {
      console.error("Error in sendMessage:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  },

  // Lấy tất cả tin nhắn của một chat
  getMessages: async (req, res) => {
    try {
      const { chatId } = req.params;
      console.log("Getting messages for chat:", chatId);

      // Lấy thông tin người dùng từ token
      const userId = getUserIdFromToken(req);
      if (!userId) {
        return res
          .status(401)
          .json({ message: "Vui lòng đăng nhập để xem tin nhắn" });
      }

      const chat = await Chat.findById(chatId)
        .populate("participants", "fullname email avatar")
        .populate("product", "product_name product_image");

      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }

      // Kiểm tra người dùng có phải là người tham gia chat không
      if (!chat.participants.some((p) => p._id.equals(userId))) {
        return res.status(403).json({ message: "Not authorized" });
      }

      res.status(200).json(chat);
    } catch (error) {
      console.error("Error in getMessages:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  },

  // Đánh dấu tin nhắn đã đọc
  markAsRead: async (req, res) => {
    try {
      const { chatId } = req.params;

      // Lấy thông tin người dùng từ token
      const userId = getUserIdFromToken(req);
      if (!userId) {
        return res
          .status(401)
          .json({ message: "Vui lòng đăng nhập để đánh dấu tin nhắn đã đọc" });
      }

      const chat = await Chat.findById(chatId);
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }

      // Đánh dấu tất cả tin nhắn của người khác là đã đọc
      let hasUnreadMessages = false;
      chat.messages.forEach((message) => {
        if (!message.sender.equals(userId) && !message.read) {
          message.read = true;
          hasUnreadMessages = true;
        }
      });

      if (hasUnreadMessages) {
        await chat.save();
      }

      res.status(200).json({ message: "Messages marked as read" });
    } catch (error) {
      console.error("Error in markAsRead:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  },

  // Lấy danh sách chat của người dùng
  getUserChats: async (req, res) => {
    try {
      // Lấy thông tin người dùng từ token
      const userId = getUserIdFromToken(req);
      if (!userId) {
        return res
          .status(401)
          .json({ message: "Vui lòng đăng nhập để xem danh sách chat" });
      }

      console.log("Getting chats for user:", userId);

      const chats = await Chat.find({ participants: userId })
        .populate("participants", "fullname email avatar")
        .populate("product", "product_name product_image")
        .sort({ lastMessageTime: -1 });

      console.log(`Found ${chats.length} chats`);
      res.status(200).json(chats);
    } catch (error) {
      console.error("Error in getUserChats:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  },

  // Lấy số lượng tin nhắn chưa đọc
  getUnreadMessagesCount: async (req, res) => {
    try {
      // Lấy thông tin người dùng từ token
      const userId = getUserIdFromToken(req);
      if (!userId) {
        return res
          .status(401)
          .json({ message: "Vui lòng đăng nhập để xem tin nhắn chưa đọc" });
      }

      // Tìm tất cả các cuộc trò chuyện
      const chats = await Chat.find({ participants: userId });

      let totalUnread = 0;
      const chatUnreadCounts = {};

      // Đếm tin nhắn chưa đọc trong mỗi cuộc trò chuyện
      for (const chat of chats) {
        const unreadCount = chat.messages.filter(
          (msg) => !msg.read && msg.sender.toString() !== userId.toString()
        ).length;

        chatUnreadCounts[chat._id] = unreadCount;
        totalUnread += unreadCount;
      }

      res.status(200).json({
        totalUnread,
        chatUnreadCounts,
      });
    } catch (error) {
      console.error("Error in getUnreadMessagesCount:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  },
};

module.exports = ChatController;
