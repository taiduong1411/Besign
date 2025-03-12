const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
const NewsModel = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    img_cover: {
        type: [Object],
        required: true
    },
    sub_content: {
        type: String,
    },
    content: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    },
    hashtags: {
        type: [String],
    },
    slug: {
        type: String,
        slug: 'title',
    }
}, {
    timestamps: true
});
module.exports = mongoose.model("news", NewsModel);