import { loginUser, registerUser } from "../services/authService.js";

export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    const result = await loginUser(username, password);

    if (result) {
        const { user, token } = result;

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600000, // 1 hour
        });

        res.redirect("/home");
    } else {
        res.status(401).json({ message: "Invalid username or password" });
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
