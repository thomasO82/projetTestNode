const authGuard = require('../middleware/authGuard')
const bookModel = require('../models/bookModel')
const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const userRouter = require('express').Router()

userRouter.get('/signin', (req,res)=>{
    res.render("pages/signin.twig")
})

userRouter.post('/signin', async(req,res)=>{
    try {
        let newUser = new userModel(req.body)
        newUser.validateSync()
        await newUser.save()
        res.redirect('/login')
    } catch (error) {
        res.json(error.message)
    }
})

userRouter.get('/login', (req,res)=>{
    res.render('pages/login.twig')
})

userRouter.post('/login',  async (req,res)=>{
    try {
        const user = await userModel.findOne({email: req.body.email}) 
        if (user) {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                req.session.user = user
                res.redirect("/dashboard")
            }else{
                throw new Error("les mot de passe ne correspondent pas")
            }
        }else{
            throw new Error("utilisateur pas enregistrer")
        }
    } catch (error) {
        res.render('pages/login.twig', {
            error: error.message
        })
    }
})

userRouter.get('/dashboard', authGuard, async(req,res)=>{
    const userFinded = await userModel.findById(req.session.user._id).populate({path: "bookCollection"})
    res.render('pages/dashboard.twig',{
       user: req.session.user,
       books: userFinded.bookCollection
        
    })
})

userRouter.get('/logout', (req,res)=>{
    req.session.destroy()
    res.redirect('/login')
})

module.exports = userRouter