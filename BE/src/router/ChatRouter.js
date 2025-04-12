const express = require("express");
const router = express.Router();
const ChatController = require("../controller/ChatController");

// Tạo hoặc lấy chat
router.post("/add-chat", ChatController.getOrCreateChat);

// Gửi tin nhắn
router.post("/:chatId/messages", ChatController.sendMessage);

// Lấy tin nhắn
router.get("/:chatId/messages", ChatController.getMessages);

// Đánh dấu đã đọc
router.put("/:chatId/read", ChatController.markAsRead);

// Lấy danh sách chat của người dùng
router.get("/user/chats", ChatController.getUserChats);

// Lấy số lượng tin nhắn chưa đọc
router.get("/unread-count", ChatController.getUnreadMessagesCount);

module.exports = router;
