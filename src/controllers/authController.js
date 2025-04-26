import { loginUser, registerUser } from "../services/authService.js";

export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    const user = await loginUser(username, password);

    if (user) {
        req.session.user = user;
        res.redirect("/home");
    } else {
        res.send("Invalid username or password");
    }
};

export const getRegister = (req, res) => {
    res.render("register", { title: "Register" });
};

export const postRegister = async (req, res) => {
    const { username, password } = req.body;

    try {
        await registerUser(username, password);
        res.send("Registration successful! You can now log in.");
    } catch (error) {
        res.send(error.message);
    }
};
