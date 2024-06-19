const express = require("express")
const mongoose = require('mongoose')
const session = require('express-session')
const userRouter = require("./routes/userRouter")
const bookRouter = require("./routes/booksRouter")
require('dotenv').config()

const app = express()
app.use(express.static('./publics'))
app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: process.env.CRYPTSESS
}))
app.use(express.urlencoded({extended: true}))
app.use(userRouter)
app.use(bookRouter)

app.listen(process.env.PORT, (err)=>{
    if (err) {
        console.log(err);
    }else{
        console.log("connecté");
    }
})


    mongoose.connect(process.env.MONGO)
