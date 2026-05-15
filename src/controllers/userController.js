import userSchema from "../models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { verifyMail } from "../emailVerify/verifyMail.js";
import sessionSchema from "../models/sessionSchema.js";
dotenv.config();

export const userRegister = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    console.log(req.file);
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/svg"];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Invalid file type",
      });
    }

    // const imageUrl = `${req.file.filename}`
    const imageUrl = `http://localhost:6000/upload/${req.file.filename}`;
    const existing = await userSchema.findOne({ email });

    if (existing) {
      return res.status(401).json({
        success: false,
        message: "User already Registered",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await userSchema.create({
      userName,
      email,
      password: hashPassword,
      profilePic: imageUrl
    });

    const token = jwt.sign({ userId: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: "5m",
    });
    verifyMail(token, email);
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

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userSchema.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    } else {
      const passwordCheck = await bcrypt.compare(password, user.password);
      if (!passwordCheck) {
        return res.status(401).json({
          success: false,
          message: "Credentials Mismatch",
        });
      } else if (passwordCheck && user.isVerified === true) {
        await sessionSchema.findOneAndDelete({ userId: user._id });
        await sessionSchema.create({ userId: user._id });

        const accessToken = await jwt.sign(
          { id: user._id },
          process.env.SECRET_KEY,
          {
            expiresIn: "10d",
          },
        );
        const refreshToken = await jwt.sign(
          { id: user._id },
          process.env.SECRET_KEY,
          {
            expiresIn: "30d",
          },
        );

        user.isLoggedIn = true;
        await user.save();
        return res.status(200).json({
          success: true,
          message: "Logged In Succesfully",
          accessToken: accessToken,
          refreshToken: refreshToken,
          data: user,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Please Verify first then login",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const existing = await sessionSchema.findOne({ userId: req.userId });
    const user = await userSchema.findById({ _id: req.userId });

    if (existing) {
      await sessionSchema.findOneAndDelete({ userId: req.userId });
      user.isLoggedIn = false;
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Session Ended Succesfully",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No Session Found",
      });
    }
  } catch (error) {
    return res.send(500).json({
      success: false,
      message: error.message,
    });
  }
};
