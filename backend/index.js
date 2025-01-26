import express from 'express'
import dotenv from 'dotenv'
import connectDB from './db/dbConnect.js'

dotenv.config();

const app = express();

app.get("/",(req,res)=>{
    res.send("Hii welcome to the authentication class!!")
})

app.listen(3000,()=>{
    connectDB()
    console.log("The server is running smoothly!!");
    
})