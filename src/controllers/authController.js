import User from "../models/User.js";

export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && (await user.comparePassword(password))) {
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

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.send("Username already exists");
    }

    const newUser = new User({ username, password });
    await newUser.save();

    res.send("Registration successful! You can now log in.");
};
