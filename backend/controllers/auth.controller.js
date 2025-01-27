import bcryptjs from 'bcryptjs'
import {generateTokenandSetCookies} from '../utils/generateTokensandCookies.js'
import {
    senderVerificationEmail,
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendResetSuccessEmail} from '../mailtrap/email.js'
    import User from '../models/user.model.js'


export const signup = async(req,res)=>{
    const {email,name,password} = req.body;

    try {
        if(!email||!name||!password){
            throw new Error("All credentials are required!!")
        }

        const userAlreadyExists = await User.findOne({email});
        console.log("userAlreadyExists",userAlreadyExists);

        if(userAlreadyExists){
            return res
            .status(400)
            .json({success:false,message:"User already exists"})
        }

        const hashedPassword = await bcryptjs.hash(password,10);
        const verificationToken = Math.floor(100000+Math.random()*900000).toString();

        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now()+24*60*60*1000,
        })

        await user.save();

        generateTokenandSetCookies(res,user._id);

        await senderVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            success:true,
            message:"User created successfully",
            user:{
                ...user._doc,
                password:undefined,
            }
        })
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}

export const login = async(req,res)=>{
    res.send("login route");
}

export const logout = async(req,res)=>{
    res.send("logout route");
}
