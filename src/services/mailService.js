import nodemailer from "nodemailer";
import { ENV } from "../utils/envLoader.js";
import { logger } from "../utils/logger.js";

export const sendVerificationEmail = async (to, token) => {
    try {
        logger.info("MAILTRAP_USER:", ENV.MAILTRAP_USER);
        logger.info("MAILTRAP_PASSWORD:", ENV.MAILTRAP_PASSWORD ? "[OK]" : "[MISSING]");

        const transporter = nodemailer.createTransport({
            host: ENV.MAILTRAP_HOST,
            port: parseInt(ENV.MAILTRAP_PORT),
            auth: {
                user: ENV.MAILTRAP_USER,
                pass: ENV.MAILTRAP_PASS,
            },
        });

        const url = `${ENV.BASE_URL}/auth/verify?token=${token}`;

        await transporter.sendMail({
            from: `"FoodMate" <${ENV.GMAIL_USER}>`,
            to,
            subject: "Verify your FoodMate email",
            html: `
        <p>Welcome to FoodMate!</p>
        <p>Click below to verify your email:</p>
        <a href="${url}">${url}</a>
      `,
        });
    } catch (err) {
        console.error("Mailer error:", err);
        throw new Error("Failed to send verification email.");
    }
};

export const sendResetPasswordEmail = async (to, token) => {
    try {
        logger.info("Sending password reset email...");

        const transporter = nodemailer.createTransport({
            host: ENV.MAILTRAP_HOST,
            port: parseInt(ENV.MAILTRAP_PORT),
            auth: {
                user: ENV.MAILTRAP_USER,
                pass: ENV.MAILTRAP_PASS,
            },
        });

        const url = `${ENV.BASE_URL}/auth/reset-password/${token}`;

        await transporter.sendMail({
            from: `"FoodMate" <${ENV.GMAIL_USER}>`,
            to,
            subject: "Reset your FoodMate password",
            html: `
        <p>You requested a password reset for your FoodMate account.</p>
        <p>Click the link below to reset your password. This link will expire in 15 minutes.</p>
        <a href="${url}">${url}</a>
        <p>If you didn’t request this, you can safely ignore this email.</p>
      `,
        });

        logger.info(`Reset password email sent to ${to}`);
        logger.info('url link ',url );
    } catch (err) {
        logger.error("Password reset mail error:", err);
        throw new Error("Failed to send password reset email.");
    }
};