import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { ENV } from "../utils/envLoader.js";

export const loginUser = async (username, password) => {
    const user = await User.findOne({ username });
    if (user && (await user.comparePassword(password))) {
        const token = jwt.sign({ id: user._id, username: user.username }, ENV.JWT_SECRET, { expiresIn: "1h" });
        return { user, token };
    }
    return null;
};

export const registerUser = async (username, password) => {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        throw new Error("Username already exists");
    }
    const newUser = new User({ username, password });
    await newUser.save();
    return newUser;
};
