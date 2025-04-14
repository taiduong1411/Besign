const News = require("../model/news");
require("dotenv");
const errorMsg = process.env.ERROR;
const successMSG = process.env.SUCCESS;
const cloudinary = require("cloudinary");
const services = require("../services/services");
const NewsController = {
  getNews: async (req, res, next) => {
    await News.find()
      .lean()
      .then((news) => {
        return res.status(200).json(news);
      });
  },
  createNews: async (req, res, next) => {
    await News.findOne({ title: req.body.title })
      .then(async (n) => {
        if (n) return res.status(300).json({ msg: "Nội Dung Đã Tồn Tại" });
        await News(req.body).save();
        return res.status(200).json({ msg: successMSG });
      })
      .catch((e) => {
        return res.status(500).json({ msg: errorMsg });
      });
  },
  useNews: async (req, res, next) => {
    await News.find({ status: true })
      .lean()
      .limit(4)
      .sort({ createdAt: -1 })
      .then((news) => {
        return res.status(200).json(news);
      });
  },
  delNews: async (req, res, next) => {
    await News.findByIdAndDelete(req.params.id)
      .then(async (news) => {
        await services.delImg(news.img_cover[0].id);
        return res.status(200).json({ msg: "Xoá Thành Công" });
      })
      .catch((err) => {
        return res.status(500).json({ msg: "Lỗi Hệ Thống" });
      });
  },
  getDetailBySlug: async (req, res, next) => {
    await News.findOne({ slug: req.params.slug })
      .then((news) => {
        news = {
          title: news.title,
          sub_content: news.sub_content,
          content: news.content,
          hashtags: news.hashtags,
          img_cover: news.img_cover[0].url,
          updatedAt: news.updatedAt.toLocaleDateString("en-Gb"),
        };
        return res.status(200).json(news);
      })
      .catch((e) => {
        return res.status(500).json({ msg: "Có lỗi xảy ra" });
      });
  },
  getNewsByTag: async (req, res, next) => {
    try {
      const query = req.params.query;
      const ITEMS_PER_PAGE = 8;
      const page = +req.query.page || 1;
      // Sử dụng biểu thức chính quy để tìm kiếm các bài blog có chứa thẻ được chỉ định
      const regex = new RegExp(query, "i"); // 'i' là để tìm kiếm không phân biệt hoa thường
      let news = await News.find({ hashtags: regex })
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
        .sort({ createdAt: -1 });
      news = news.map((n) => {
        return {
          title: n.title,
          sub_content: n.sub_content,
          content: n.content,
          hashtags: n.hashtags,
          img_cover: n.img_cover[0].url,
          slug: n.slug,
          updatedAt: n.updatedAt.toLocaleDateString("en-Gb"),
        };
      });
      const totalItems = await News.countDocuments();
      return res.status(200).json({
        news: news,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        totalItems: totalItems,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    } catch (error) {
      // Xử lý lỗi nếu có
      return res.status(500).json({ message: "Server Error" });
    }
  },
  getAllData: async (req, res, next) => {
    try {
      const ITEMS_PER_PAGE = 9;
      const page = +req.query.page || 1;
      let news = await News.find({ status: true })
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
        .sort({ createdAt: -1 });
      news = news.map((n) => {
        return {
          title: n.title,
          sub_content: n.sub_content,
          content: n.content,
          hashtags: n.hashtags,
          img_cover: n.img_cover[0].url,
          slug: n.slug,
          updatedAt: n.updatedAt.toLocaleDateString("en-Gb"),
        };
      });
      const totalItems = await News.countDocuments();
      // const totalItems = (((10 - ITEMS_PER_PAGE) * ITEMS_PER_PAGE) + countItems);
      const uniqueHashtags = await News.aggregate([
        { $unwind: "$hashtags" }, // Tách mảng hashtags thành các mục đơn lẻ
        { $group: { _id: { $toLower: "$hashtags" } } }, // Nhóm các mục theo từng hashtag và đếm số lượng
        { $sort: { _id: 1 } }, // Sắp xếp theo thứ tự bảng chữ cái của hashtag
      ]);
      return res.status(200).json({
        news: news,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        totalItems: totalItems,
        uniqueHashtags: uniqueHashtags,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    } catch (error) {
      // Xử lý lỗi nếu có
      return res.status(500).json({ message: "Server Error" });
    }
  },
  updateNews: async (req, res, next) => {
    try {
      const newsId = req.params.id;
      const updatedData = req.body;
      console.log(updatedData);

      // Kiểm tra xem tin tức có tồn tại không
      const existingNews = await News.findById(newsId);
      if (!existingNews) {
        return res.status(404).json({ msg: "Không tìm thấy tin tức" });
      }

      // Kiểm tra xem có thay đổi ảnh đại diện không
      if (
        updatedData.img_cover &&
        existingNews.img_cover[0].id &&
        updatedData.img_cover[0].id !== existingNews.img_cover[0].id
      ) {
        // Xóa ảnh cũ trên Cloudinary nếu ảnh được thay đổi và ảnh cũ là upload (không phải URL)
        if (existingNews.img_cover[0].id.startsWith("trungduc/")) {
          await services.delImg(existingNews.img_cover[0].id);
        }
      }

      // Cập nhật tin tức
      const updatedNews = await News.findByIdAndUpdate(
        newsId,
        updatedData,
        { new: true } // Trả về document đã được cập nhật
      );

      return res.status(200).json({
        msg: "Cập nhật tin tức thành công",
        news: updatedNews,
      });
    } catch (error) {
      console.error("Lỗi cập nhật tin tức:", error);
      return res
        .status(500)
        .json({ msg: "Lỗi hệ thống", error: error.message });
    }
  },
};
module.exports = NewsController;
