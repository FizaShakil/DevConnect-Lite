import mongoose, {Schema} from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken'

const developerSchema = new Schema({
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
    description:{
        type: String,
    },
    skills:{
        type: [String], 
        required: true
    },
    role: { 
        type: String, 
        default: "developer" 
    }, 
    refreshToken:{
        type: String
    }
}, {timestamps:true})

developerSchema.pre("save", async function(next){
      if(!this.isModified('password')) return next();
      this.password = await bcryptjs.hash(this.password, 10)
      next()
})

developerSchema.methods.isPasswordCorrect = async function (password){
    return bcryptjs.compare(password, this.password) //returns true or false
}

developerSchema.methods.generateAccessTokens = function(){
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

developerSchema.methods.generateRefreshTokens = function(){
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

export const Developer = mongoose.model("Developer", developerSchema)