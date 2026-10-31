import User from '../../models/user.js'
import {inngest} from '../inngest/client.js'
import {bcrypt} from 'bcrypt'

export const signup = async(req,res)=>{
    const {email,password , OS=[]} = req.body
    try {
        const hashedPass = brcypt.hash(password,10)
        const createUser = await User.create({email,password:hashedPass, OS})

        //  fire Inngest Event

        await inngest.send({
            name:"user/signup",
            data:{
                email
            }
        });
        

    } catch (error) {
        
    }
}
