const express = require('express');
const router = express.Router();
const NewsController = require('../controller/NewsController');
const adminAuth = require('../middleware/AdminAuth');

router.get('/all-news', adminAuth, NewsController.getNews);
router.get('/user-get-news', NewsController.useNews);
router.get('/user-get-detail/:slug', NewsController.getDetailBySlug);
router.get('/user-get-news-by-tag/:query', NewsController.getNewsByTag);
router.get('/user-all-news', NewsController.getAllData);

router.post('/create-news', adminAuth, NewsController.createNews);



router.delete('/del-news-id/:id', adminAuth, NewsController.delNews);
module.exports = router;