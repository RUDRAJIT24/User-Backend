import userSchema from "../models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { verifyMail } from "../emailVerify/verifyMail.js";
dotenv.config();

export const userRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existing = await userSchema.findOne({ email });
    if (existing) {
      return res.status(401).json({
        success: false,
        message: "User already Registered",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await userSchema.create({
      username,
      email,
      password: hashPassword,
    });

    const token = jwt.sign({ userId: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: "5m",
    });
    await verifyMail(token, email);
    newUser.token = token;
    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User not registered",
    });
  }
};
