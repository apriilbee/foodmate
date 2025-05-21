import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { ENV } from "../utils/envLoader.js";
import { sendVerificationEmail } from "./mailService.js";
import crypto from "crypto";
import { logger } from "../utils/logger.js";
import { sendResetPasswordEmail } from "./mailService.js";

export const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) return null;

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return null;

    if (!user.isVerified) {
        throw new Error("Please verify your email before logging in.");
    }

    const token = jwt.sign(
        {
            id: user._id,
            email: user.email,
            username: user.username,
        },
        ENV.JWT_SECRET,
        { expiresIn: "1h" }
    );

    return { user, token };
};
export const registerUser = async (email, password, username) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("Email is already registered");

    const user = new User({
        email,
        password,
        username,
        verificationToken: crypto.randomBytes(32).toString("hex"),
        isVerified: false,
    });
    await user.save();
    await sendVerificationEmail(email, user.verificationToken);
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


//  Handle Forgot Password (Send reset email)
export const requestPasswordReset = async (email) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("No account found with this email.");
    }

    // Generate secure token and expiry
    const token = crypto.randomBytes(32).toString("hex");
    const expiration = Date.now() + 15 * 60 * 1000; // 15 minutes

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expiration;
    await user.save();

    await sendResetPasswordEmail(user.email, token);
};

//  Handle Password Reset (Validate token & update password)
export const resetPassword = async (token, newPassword) => {
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
        throw new Error("Invalid or expired reset token.");
    }
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    logger.info(` Password reset successful for ${user.email}`);
};