import { loginUser, registerUser, verifyEmailToken } from "../services/authService.js";
import { logger } from "../utils/logger.js";
import validator from "validator";

export const postLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await loginUser(email, password);
        if (!result) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        res.cookie("token", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 15 * 60 * 1000,
        });

        return res.status(200).json({ redirectUrl: "/home" });
    } catch (error) {
        logger.error("Login error:", error);

        // Send the actual error message back to the frontend as JSON
        return res.status(400).json({
            message: error.message || "Login failed.",
        });
    }
};
export const getRegister = (req, res) => {
    res.render("register", { title: "Register" });
};

export const postRegister = async (req, res) => {
    const { email, password } = req.body;

    try {
        const isStrong = validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        });

        if (!isStrong) {
            return res.status(400).json({
                message: "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.",
            });
        }

        await registerUser(email, password);
        res.status(201).json({ redirectUrl: "/?registered=true" });
    } catch (error) {
        logger.error("Register error:", error);
        res.status(400).json({ message: error.message || "Registration failed." });
    }
};

export const verifyEmail = async (req, res) => {
    const { token } = req.query;

    try {
        const verifiedEmail = await verifyEmailToken(token);
        res.redirect(`/?verified=true&email=${encodeURIComponent(verifiedEmail)}`);
    } catch (err) {
        logger.error("Email verification error:", err);
        res.status(400).send(err.message || "Server error.");
    }
};
