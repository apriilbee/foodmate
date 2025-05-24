import * as profileService from "../services/profileService.js";
import UserPreferences from "../models/UserPreferences.js";
import { ALLERGY_OPTIONS, DIETARY_OPTIONS } from "../constants/recipeFilters.js";

export const getProfile = async (req, res) => {
    try {
        const userData = await profileService.getUserProfileData(req.user.id);

        // Fetch saved dietary and allergy preferences
        const preferences = await UserPreferences.findOne({ userId: req.user.id });

        const dietaryPrefs = preferences?.dietary || [];
        const allergyPrefs = preferences?.allergies || [];

        res.render("profile", {
            title: "Profile Settings",
            user: userData,
            message: null,
            dietaryPrefs,
            allergyPrefs,
            allergyOptions: ALLERGY_OPTIONS,
            dietaryOptions: DIETARY_OPTIONS,
        });
    } catch (error) {
        console.error("Error loading profile:", error);
        res.render("profile", {
            title: "Profile Settings",
            user: req.user,
            message: "Failed to load profile settings",
            dietaryPrefs: [],
            allergyPrefs: [],
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        await profileService.updateUserPassword(req.user.id, currentPassword, newPassword, confirmPassword);
        res.status(200).json({ success: true, message: "Password updated successfully." });
    } catch (err) {
        console.error("Error updating profile:", err.message);
        res.status(400).json({ success: false, message: err.message });
    }
};

export const updateDietaryPreferences = async (req, res) => {
    try {
        const { dietary, allergies, dietaryOther, allergyOther } = req.body;
        const userId = req.user.id;
        const result = await profileService.updateUserPreferences(
            userId,
            dietary,
            allergies,
            dietaryOther,
            allergyOther
        );
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

export const deleteAccount = async (req, res) => {
    try {
        await profileService.deleteUserAccount(req.user.id);
        req.logout?.();
        req.session?.destroy?.();
        res.status(200).json({ success: true, message: "Account deleted successfully" });
    } catch (error) {
        console.error("Error deleting account:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const uploadProfilePicture = async (req, res) => {
    try {
        const profilePicPath = await profileService.updateProfilePic(req.user.id, req.file);
        res.status(200).json({
            success: true,
            message: "Profile picture updated successfully",
            profilePic: profilePicPath,
        });
    } catch (err) {
        console.error("Error uploading profile picture:", err.message);
        res.status(400).json({ success: false, message: err.message });
    }
};

export const updateEmail = async (req, res) => {
    try {
        const { newEmail, currentPassword } = req.body;
        const userId = req.user.id;

        const result = await profileService.changeEmailInProfile(userId, newEmail, currentPassword);

        res.status(200).json({
            success: true,
            message: "Email updated successfully",
            email: result.email,
        });
    } catch (err) {
        console.error("Email update error:", err.message);
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};
