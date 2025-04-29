import User from "../models/User.js";
import validator from "validator";
import bcrypt from "bcryptjs";

export const getProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        res.render("profile", {
            title: "Profile Settings",
            user,
            message: null,
        });
    } catch (error) {
        console.error("Error loading profile:", error);
        res.status(500).render("profile", {
            title: "Profile Settings",
            user: null,
            message: "Failed to load profile settings",
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const { name, email, currentPassword, newPassword, confirmPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        let updated = false;

        // Update name
        if (name && name.trim() && name !== user.name) {
            user.name = name.trim();
            updated = true;
        }

        // Update email
        if (email && email.trim() && email !== user.email) {
            if (!validator.isEmail(email)) {
                return res.status(400).json({ error: "Invalid email format." });
            }
            user.email = email.trim();
            updated = true;
        }

        // Update password
        if (currentPassword || newPassword || confirmPassword) {
            if (!currentPassword || !newPassword || !confirmPassword) {
                return res.status(400).json({ error: "All password fields must be filled." });
            }

            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: "Current password is incorrect." });
            }

            if (newPassword !== confirmPassword) {
                return res.status(400).json({ error: "New passwords do not match." });
            }

            if (newPassword.length < 6) {
                return res.status(400).json({ error: "Password must be at least 6 characters." });
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
            updated = true;
        }

        if (!updated) {
            return res.status(400).json({ error: "No changes detected." });
        }

        await user.save();

        res.status(200).json({ message: "Profile updated successfully." });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

export const updateDietaryPreferences = async (req, res) => {
    try {
        const userId = req.user._id;

        const { dietary, dietaryOther, allergies, allergyOther } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        let updatedDietary = [];
        let updatedAllergies = [];

        if (Array.isArray(dietary)) {
            updatedDietary = dietary;
        } else if (dietary) {
            updatedDietary = [dietary];
        }

        if (dietaryOther && dietaryOther.trim()) {
            updatedDietary.push(dietaryOther.trim());
        }

        if (Array.isArray(allergies)) {
            updatedAllergies = allergies;
        } else if (allergies) {
            updatedAllergies = [allergies];
        }

        if (allergyOther && allergyOther.trim()) {
            updatedAllergies.push(allergyOther.trim());
        }

        user.dietaryPreferences = updatedDietary;
        user.allergies = updatedAllergies;

        await user.save();

        res.status(200).json({ message: "Dietary preferences and allergies updated successfully." });
    } catch (error) {
        console.error("Error updating dietary preferences:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};
