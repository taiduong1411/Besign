const express = require('express');
const router = express.Router();
const ContactController = require('../controller/ContactController');
const adminAuth = require('../middleware/AdminAuth');


router.post('/contact-us', ContactController.postContact);
router.get('/all-contact', adminAuth, ContactController.getAllContact);
router.delete('/delete-contact/:_id', adminAuth, ContactController.delContact);
module.exports = router;