import express, { Request, Response } from "express";
import rateLimit from 'express-rate-limit';
import FormData from 'form-data';
import dotenv from 'dotenv'
import cors from 'cors'
import axios from 'axios'

const app = express();
app.use(express.json());
dotenv.config();
app.use(cors())
const secretKey=process.env.SECRET_KEY
if (!secretKey) {
  throw new Error(" SECRET KEY not set in environment variables");
}

const otpStore: Record<string, string> = {};

const otpLimiter=rateLimit({
  windowMs:5*60*1000,
  max:3,
  message:'Too many requests, Try again after 5 minutes',
  standardHeaders:true,
  legacyHeaders:false
});

const passWordResetLimiter=rateLimit({
  windowMs:15*60*1000,
  max:5,
  message:"Too many password reset attempts. Please try again after 15 minutes",
  standardHeaders:true,
  legacyHeaders:false,
});

app.post("/generate-otp",otpLimiter, (req: Request, res: Response):Response => {
  const email = req.body.email;
  if (!email) {
    return res.status(400).json({ message: "Email is needed" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = otp;

  console.log(`Otp for ${email}: ${otp}`);
  return res.status(200).json({ message: "OTP generated successfully" });
});


app.post("/reset-password", passWordResetLimiter, async (req: Request, res: Response) => {
  const { email, otp, newPassword, token } = req.body;

  const formData = new FormData();
  formData.append("secret", secretKey);
  formData.append("response", token);

  try {
    const response = await axios.post(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      formData,
      {
        headers: formData.getHeaders(), // required
      }
    );

    const result = response.data;
    console.log("Result is", result);

    if (!result.success) {
      return res.status(403).json({ message: "CAPTCHA verification failed", errorCodes: result['error-codes'] });
    }

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP and new password are needed" });
    }

    if (otpStore[email] === otp) {
      console.log(`Password for ${email} reset to: ${newPassword}`);
      delete otpStore[email];
      return res.status(200).json({ message: "Password has been reset successfully" });
    } else {
      return res.status(401).json({ message: "Invalid OTP" });
    }
  } catch (e) {
    console.error("Failed to verify Turnstile CAPTCHA:", e);
    return res.status(500).json({ message: "Internal error during CAPTCHA verification" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
