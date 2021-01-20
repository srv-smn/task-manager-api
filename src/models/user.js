const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
        trim: true
    },
    email:{
        type:String,
        unique: true ,
        required: true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0){
                throw new Error('Age must be a positive number')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        validate(value){
            if(value.length<7)
            {
                throw new Error('Password should be greater than 6 digits')
            }
            if(value.includes('password')){
                throw new Error('Password should not contain password in it')
            }
        }
    }
})

userSchema.statics.findByCredentials = async(email, password) =>{
    const user = await User.findOne({email})
    console.log("user: ",user);
    if(!user){
        throw new Error('Unable to Login')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('Unable to Login')
    }
    return user
}

// hash password before saving 
userSchema.pre('save',async function(next){
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }

})

const User = mongoose.model('User',userSchema)

module.exports = User