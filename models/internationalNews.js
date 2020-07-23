const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const InternationalNewsSchema = new Schema({
    title: {
        type: String
    },

    content: {
        type: String
    },
    time: {
        type: String
    },
    img: {
        type: String,
        required: false
    },
    link: {
        type: String,
        required: false
    }

})

const InternationalNews  = mongoose.model('internationalNews',InternationalNewsSchema)


module.exports = InternationalNews