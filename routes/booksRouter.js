const bookRouter = require("express").Router()
const bookModel = require("../models/bookModel")
const authGuard = require('../middleware/authGuard')
const upload = require('../middleware/upload')
const userModel = require("../models/userModel")



bookRouter.get('/addbook', authGuard, (req, res) => {
    res.render("pages/addBook.twig", {
        user: req.session.user
    })
})

bookRouter.post('/addbook', authGuard, upload.single('img'), async (req, res) => {
    try {
        if (req.file) {
            req.body.photo = req.file.filename
        }
        const newBook = new bookModel(req.body)
        newBook.validateSync()
        await newBook.save()
        await userModel.updateOne({_id: req.session.user._id},{$push : {bookCollection: newBook._id}})
        res.redirect("/dashboard")
    } catch (error) {
        res.render("pages/addBook.twig", {
            user: req.session.user,
            error: error.message
        })
    }
})

module.exports = bookRouter