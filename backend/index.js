import express from 'express'
import dotenv from 'dotenv'
import connectDB from './db/dbConnect.js'
import authRoutes from './routes/auth.route.js'

dotenv.config();

const app = express();

app.get("/",(req,res)=>{
    res.send("Hii welcome to the authentication class!!")
})

app.use('/api/auth',authRoutes)

app.listen(3000,()=>{
    connectDB()
    console.log("The server is running smoothly!!");
    
})