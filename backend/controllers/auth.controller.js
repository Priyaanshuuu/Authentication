import bcryptjs from 'bcryptjs'
import {generateTokenandSetCookies} from '../utils/generateTokensandCookies.js'
import {
    senderVerificationEmail,
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendResetSuccessEmail} from '../mailtrap/email.js'
    import {User} from '../models/user.model.js'


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
    const {email,password}= req.body;
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(400)
            .json({success:false,
                message:"Invalid credentials"
            })
        }
        const isPasswordCorrect = await bcryptjs.compare(password,user.password)
        if(!isPasswordCorrect){
            return res.status(400).json({success:false,
                message:"Invalid credentials"})
        }

        generateTokenandSetCookies(res,user._id);

        user.lastlogin = new Date();
        await user.save();

        res.status(200).json({
            success:true,
            message:"LoggedIn successfully",
            user:{
                ...user._doc,
                password: undefined,
            }
        })
    } catch (error) {
        console.log("Error in login",error);
        res.status(400).json({
            success:false,message:error.message
        })
        
    }
}

export const logout = async(req,res)=>{
    res.clearCookie("token");
    res.status(200).json({success:true,message:
        "Logged Out successfully!"
    })
}

export const verifyEmail = async(req,res)=>
{
const {code} = req.body;
try {
    const user = await User.findOne({
        verificationToken: code,
        verificationTokenExpiresAt: {$gt: Date.now()},
    })
    if(!user){
        return res.status(400).json({success:false,message:"Invalid or expired verification code"})
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt= undefined;
    await user.save();

    await sendWelcomeEmail(user.email,user.name);

    res.status(200).json({
        success:true,
        message:"Email verified successfully",
        user:{
            ...user._doc,
            password:undefined,
        }
    })
} catch (error) {
    console.log("Error in verifyEmail",error);
    res.status(500).json({success:false,message:"Server Error"})
    
    
}
}

