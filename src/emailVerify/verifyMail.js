import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config()

export const verifyMail = async (token, email) => {
    const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.email,
      pass: process.env.password,
    },
  });

  const mailConfigurations = {
    from: process.env.email,
    to: email,
    subject: "Email Verification For Todo",
    text: `http://localhost:6000/verify/${token}`        
  };

  transporter.sendMail(mailConfigurations, function (error, info) {
    if (error) {
      console.error("Error sending email:", error);
      throw new Error(error);
    }
    console.log("Email Sent Successfully");
    console.log(info);
  });
};

