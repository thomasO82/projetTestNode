const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Le titre est requis"],
    },
    author : {
        type: String,
        required: [true, "l'auteur est requis"]
    },
    publishedDate : {
        type: Date,
        required: [true, "la date est requis"]
    },
    photo: {
        type: String,
    }
})

const bookModel = mongoose.model('books', bookSchema)

module.exports = bookModel