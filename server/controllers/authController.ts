import { Request, Response } from "express";
import User from '../models/User';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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