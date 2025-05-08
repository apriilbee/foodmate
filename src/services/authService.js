import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { ENV } from "../utils/envLoader.js";
import { sendVerificationEmail } from "./mailService.js";
import crypto from "crypto";
import { logger } from "../utils/logger.js";

export const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) return null;

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return null;

    if (!user.isVerified) {
        throw new Error("Please verify your email before logging in.");
    }

    const token = jwt.sign({ id: user._id, email: user.email }, ENV.JWT_SECRET, { expiresIn: "1h" });

    return { user, token };
};
export const registerUser = async (email, password) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("Email is already registered");

    const verificationToken = crypto.randomBytes(32).toString("hex");
    await sendVerificationEmail(email, verificationToken);

    const newUser = new User({ email, password, verificationToken });
    await newUser.save();

    return newUser;
};

export const verifyEmailToken = async (token) => {
    logger.info(`🔍 Verifying token: ${token}`);

    if (!token) {
        throw new Error("Missing verification token.");
    }

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
        throw new Error("Invalid or expired verification token.");
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    logger.info(`✅ Email verified for user: ${user.email}`);
    return user.email;
};
