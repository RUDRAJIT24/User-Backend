import userSchema from "../models/userSchema.js";

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
    const newUser = await userSchema.create({ username, email, password });
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User not registered",
    });
  }
};
