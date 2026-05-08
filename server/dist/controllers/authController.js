"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.verifyOtp = exports.forgotPassword = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer_1 = __importDefault(require("nodemailer"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const exists = yield User_1.default.findOne({ email });
    if (exists)
        return res.status(400).json({ msg: "User Exists" });
    const hashed = yield bcrypt.hash(password, 10);
    yield User_1.default.create({ name, email, password: hashed });
    res.json({ msg: "Registered" });
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.default.findOne({ email });
        if (!user)
            return res.status(400).json({ msg: "Invalid Credentials" });
        const isMatch = yield bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ msg: "Invalid Credentials" });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.json({ token, user });
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.login = login;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield User_1.default.findOne({ email });
        if (!user)
            return res.status(400).json({ msg: "User not found with this Email" });
        //Generate OTP 
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        yield user.save();
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        yield transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP is ${otp}`,
        });
        res.json({
            msg: "OTP sent to email"
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Server error",
        });
    }
});
exports.forgotPassword = forgotPassword;
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    const user = yield User_1.default.findOne({ email });
    if (!user)
        return res.status(404).json({ msg: "User not found" });
    if (user.otp !== otp ||
        !user.otpExpiry ||
        user.otpExpiry < new Date()) {
        return res.status(400).json({
            msg: "Invalid or expired OTP",
        });
    }
    res.json({ msg: "OTP verified" });
});
exports.verifyOtp = verifyOtp;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield User_1.default.findOne({ email });
    if (!user) {
        return res.status(404).json({ msg: "User not found" });
    }
    const hashedPassword = yield bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;
    yield user.save();
    res.json({ msg: "Password updated successfully" });
});
exports.resetPassword = resetPassword;
