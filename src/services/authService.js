import User from "../models/User.js";

export const loginUser = async (username, password) => {
    const user = await User.findOne({ username });
    if (user && (await user.comparePassword(password))) {
        return user;
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
