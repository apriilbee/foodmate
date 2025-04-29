import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: { type: String, required: true, unique: true },
    dietaryPreferences: [String],
    allergies: [String]
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = function (inputPassword) {
    return bcrypt.compare(inputPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
