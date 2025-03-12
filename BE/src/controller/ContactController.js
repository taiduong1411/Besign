const Contact = require('../model/contact');


const ContactController = {
    postContact: async (req, res, next) => {
        try {
            await Contact(req.body).save()
            return res.status(200).json({ msg: 'Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất !' })
        } catch (error) {
            return res.status(500).json({ msg: 'server error' })
        }
    },
    getAllContact: async (req, res, next) => {
        try {
            const contacts = await Contact.find().sort({ createdAt: -1 })
            return res.status(200).json(contacts)
        } catch (error) {
            return res.status(500).json({ msg: 'server error' })
        }
    },
    delContact: async (req, res, next) => {
        try {
            await Contact.findByIdAndDelete(req.params._id);
            return res.status(200).json({ msg: 'Đã xoá thành công' });
        } catch (error) {
            return res.status(500).json({ msg: 'server error' });
        }
    }
}
module.exports = ContactController