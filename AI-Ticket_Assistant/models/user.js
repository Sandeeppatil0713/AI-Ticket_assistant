import mongoose from 'mongoose';
import { PassThrough } from 'nodemailer/lib/xoauth2';

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        requried:true,
        unique:true
    },
    Password:{
        type:String,
        requried:true
    },
    role:{  
        type:String, 
        default:"user", 
        enum:["user", "moderator", "admin"]
    },
    OS:[String],
    createdAt:{
        type:Date, 
        default:Date.now
    }
})

export default mongoose.model('User', userSchema);