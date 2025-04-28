import { loginUser, registerUser } from "../services/authService.js";

export const postLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await loginUser(username, password);

        if (!result) {
            res.status(400);
            return res.render("index", { title: "Login", error: "Invalid username or password" });
        }

        const { accessToken } = result;

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 15 * 60 * 1000,
        });

        res.redirect("/home");
    } catch (error) {
        logger.error("Login error:", error);
        res.render("index", { title: "Login", error: "An unexpected error occurred. Please try again." });
    }
};

export const getRegister = (req, res) => {
    res.render("register", { title: "Register" });
};

export const postRegister = async (req, res) => {
    const { username, password } = req.body;

    try {
        await registerUser(username, password);
        res.redirect("/");
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
