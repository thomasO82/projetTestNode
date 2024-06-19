const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
require('dotenv').config()

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Le nom est requis"],
        validate: {
            validator: function (value) {
                return /^[a-zA-Z]{3,29}$/.test(value);
            },
            message: "le nom doit contenir des caracteres valides"
        }
    },
    firstname: {
        type: String,
        required: [true, "le prenom est requis"],
        validate: {
            validator: function (value) {
                return /^[a-zA-Z]{3,29}$/.test(value);
            },
            message: "le prenom doit contenir des caracteres valides"
        }
    },

    email: {
        type: String,
        required: [true, "le mail est requis"],
        validate: {
            validator: function (value) {
                return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value);
            },
            message: "le mail  doit contenir des caracteres valides"
        }
    },
    password: {
        type: String,
        required: [true, "le password est requis"],
        validate: {
            validator: function (value) {
                return /^(?=.*\d).{8,}$/.test(value);
            },
            message: "le password doit contenir des caracteres valides"
        }
    },
    bookCollection: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "books"
        }
    ]
})

userSchema.pre('save', async function (next) {
    if (this.isModified("password")) {
        this.password = bcrypt.hashSync(this.password, parseInt(process.env.SALT))
    }
    next()
})

userSchema.pre("validate", async function (next) {
    try {
        const existingUser = await this.constructor.findOne({ email: this.email });
        if (existingUser) {
            this.invalidate("email", "Cet email est déjà enregistré."); 
        }
        next();
    } catch (error) {
        next(error);
    }
});







const userModel = mongoose.model('users', userSchema)




module.exports = userModel