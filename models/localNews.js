const mongoose = require('mongoose')
const Schema = mongoose.Schema


//local news Schema & Model

const LocalNewsSchema = new Schema({
    title: {
        type: String
    },

    body: {
        type: String
    },
    date: {
        type: Date
    },
    img: {
        type: String,
        required: [true,'Image URL is required']
    },
    link: {
        type: String,
        required: false
    },
    category: {
        type: String
    }

})

const LocalNews = mongoose.model('localNews', LocalNewsSchema)

module.exports = LocalNews