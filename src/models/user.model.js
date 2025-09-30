import mongoose, {Schema} from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken'

const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        index: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password:{
        type: String,
        required: [true, "Password is required"]
    },
     role: { 
        type: String, 
        default: "user" 
    }, 
    refreshToken:{
        type: String
    }
}, {timestamps:true})

userSchema.pre("save", async function(next){
      if(!this.isModified('password')) return next();
      this.password = await bcryptjs.hash(this.password, 10)
      next()
})

userSchema.methods.isPasswordCorrect = async function (password){
    return bcryptjs.compare(password, this.password) //returns true or false
}

userSchema.methods.generateAccessTokens = function(){
    return jwt.sign(
        {
            _id: this.id,
            email: this.email,
            role: this.role,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshTokens = function(){
    return jwt.sign(
        {
            _id: this.id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)