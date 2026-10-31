import { useReducer } from 'react';
import User from '../../models/user.js'
import {inngest} from '../inngest/client.js'
import {bcrypt} from 'bcrypt'

export const signup = async(req,res)=>{
    const {email,password , OS=[]} = req.body
    try {
        const hashedPass = bcrypt.hash(password,10)
        const user = await User.create({email,password:hashedPass, OS})

        //  fire Inngest Event

        await inngest.send({
            name:"user/signup",
            data:{
                email
            }
        });
        
        const token = jwt.sign({_id:user._id, role:user.role},process.env.JWT_SECRET)
        res.json({user,token})
    } catch (error) {
        res.status(500).json({error:"Sign-up Failed", 
        details: error.message})
    }
};

export const login = async(req,res)=>{
    const {email,password}= req.body

    try {
        const user = User.findOne({email})
        if(!user) return res.status(401).json({error:"User not found "})

            const isMatch = await bcrypt.compare(password,user.password);

            if(!isMatch){
                return res.status(401).json({error:"Invalid credentials"})
            }

            const token = jwt.sign({_id:user._id, role:user.role},process.env.JWT_SECRET)
            res.json({user,token})
    } catch (error) {
          res.status(500).json({error:"Loged-in Failed", 
          details: error.message})
    }
};

export const logout = async(req,res)=>{
    try {
        const token = req.headers.authorization.split(" ")[1]

        if(!token) return res.status(401)
                             .json({error:"Unauthorzied"})
        jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if(err) return res.status(401)
                          .json({error:"Unauthorized"})})
        res.json({message:"Logout successfully"})
                          
    } catch (error) {
        
    }
};

export const updateUser = async(req,res)=>{
    const {OS = [],role,email} = req.body

    try {
        if(req.user?.role !== "admin"){
            return res.status(403).json({error:"Forbidden"})
        }
        const user = await User.findOne({email})
        if(!user) return res.status(401).json({error:"User not found"});

        await User.updateOne(
            {email},
            {OS: OS.length ? OS : user.OS, role}
        )
        return res.json({message: "User Updated Successfully"})
    } catch (error) {
            res.status.json({error: "Update Failed", details:error.message})
    }
}

export const getUsers = async(req,res)=>{
    try {
        if(!req.user.role !== "admin"){
            return res.status(403).json({error:"Forbidden"})
        }
        const users =  await User.find().select("-password")
        return res.json(users)
    } catch (error) {
        res.status(500).json({error:"Update failed", details: error.message});
    }
}