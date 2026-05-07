import { Request, Response } from "express";
import User from '../models/User';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
import nodemailer from "nodemailer";

export const register = async(req : Request, res : Response) => {

    const {name, email, password} = req.body;

    const exists = await User.findOne({email})

    if(exists) return res.status(400).json({msg : "User Exists"});

    const hashed = await bcrypt.hash(password, 10);

    await User.create({name, email, password: hashed});

    res.json({msg: "Registered"});
};

export const login = async (req : Request, res : Response) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email});

        if(!user) return res.status(400).json({msg : "Invalid Credentials"})

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) return res.status(400).json({msg : "Invalid Credentials"});

        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET as string,
            {expiresIn: "7d"}
        );

        res.json({token, user});
    } catch (error) {
        res.status(500).json(error);
    }
};

export const forgotPassword = async(req: Request, res: Response) => {
    try {
        const {email} = req.body;

        const user = await User.findOne({email});

        if(!user) return res.status(400).json({msg : "User not found with this Email"});

        //Generate OTP 
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

        await user.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP is ${otp}`,
        });

        res.json({
            msg: "OTP sent to email"
        });
    } catch (error) {

        console.log(error);
        res.status(500).json({
            msg: "Server error",
        });
    }
}

export const verifyOtp = async(req: Request, res: Response) => {
    const {email, otp} = req.body;

    const user = await User.findOne({email});

    if(!user) return res.status(404).json({msg: "User not found"});

    if(
        user.otp !== otp ||
        !user.otpExpiry ||
        user.otpExpiry < new Date()
    ){
        return res.status(400).json({
            msg: "Invalid or expired OTP",
        });
    }

    res.json({msg: "OTP verified"});
}

export const resetPassword = async(req: Request, res: Response) => {

    const {email, password} = req.body;

    const user = await User.findOne({email});

    if(!user){
        return res.status(404).json({msg: "User not found"})
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    res.json({msg: "Password updated successfully"});
};

