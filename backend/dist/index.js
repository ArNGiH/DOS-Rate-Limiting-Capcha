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
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const form_data_1 = __importDefault(require("form-data"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
dotenv_1.default.config();
app.use((0, cors_1.default)());
const secretKey = process.env.SECRET_KEY;
if (!secretKey) {
    throw new Error(" SECRET KEY not set in environment variables");
}
const otpStore = {};
const otpLimiter = (0, express_rate_limit_1.default)({
    windowMs: 5 * 60 * 1000,
    max: 3,
    message: 'Too many requests, Try again after 5 minutes',
    standardHeaders: true,
    legacyHeaders: false
});
const passWordResetLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "Too many password reset attempts. Please try again after 15 minutes",
    standardHeaders: true,
    legacyHeaders: false,
});
app.post("/generate-otp", otpLimiter, (req, res) => {
    const email = req.body.email;
    if (!email) {
        return res.status(400).json({ message: "Email is needed" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = otp;
    console.log(`Otp for ${email}: ${otp}`);
    return res.status(200).json({ message: "OTP generated successfully" });
});
app.post("/reset-password", passWordResetLimiter, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp, newPassword, token } = req.body;
    const formData = new form_data_1.default();
    formData.append("secret", secretKey);
    formData.append("response", token);
    try {
        const response = yield axios_1.default.post("https://challenges.cloudflare.com/turnstile/v0/siteverify", formData, {
            headers: formData.getHeaders(), // required
        });
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
        }
        else {
            return res.status(401).json({ message: "Invalid OTP" });
        }
    }
    catch (e) {
        console.error("Failed to verify Turnstile CAPTCHA:", e);
        return res.status(500).json({ message: "Internal error during CAPTCHA verification" });
    }
}));
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
