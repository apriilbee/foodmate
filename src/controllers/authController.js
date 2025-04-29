import { loginUser, registerUser } from "../services/authService.js";
import { logger } from "../utils/logger.js";
import validator from "validator";

export const postLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await loginUser(username, password);

        if (!result) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        const { token } = result;

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 15 * 60 * 1000,
        });

        return res.status(200).json({ redirectUrl: "/home" });
    } catch (error) {
        logger.error("Login error:", error);

        return res
            .status(500)
            .render("index", { title: "Login", error: "An unexpected error occurred. Please try again." });
    }
};

export const getRegister = (req, res) => {
    res.render("register", { title: "Register" });
};

export const postRegister = async (req, res) => {
    const { username, password } = req.body;

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

        await registerUser(username, password);

        res.status(201).json({ redirectUrl: "/" });
    } catch (error) {
        console.error("Register error:", error);
        res.status(400).json({ message: error.message || "Registration failed." });
    }
};
