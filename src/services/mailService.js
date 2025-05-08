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
