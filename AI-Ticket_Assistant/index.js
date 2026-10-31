import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'
import dotenv from'dotenv/config';
import dns from 'dns';

dns.setServers(['8.8.8.8','1.1.1.1'])



const PORT = process.env.PORT || 3000
const app = express();
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Database Connected Successfully 👍");
        app.listen(PORT,()=> console.log("🚀 Server running http://localhost:3000"));
         })
    .catch((err)=>{
        console.error("👎 MongoDB Error:",err);
        
    }) 