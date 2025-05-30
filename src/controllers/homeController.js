import UserProfile from "../models/UserProfile.js";
import UserPreferences from "../models/UserPreferences.js";
import { logger } from "../utils/logger.js";
import { ALLERGY_OPTIONS } from "../constants/recipeFilters.js";

export const getIndex = (req, res) => {
    res.render("index", { title: "Login", error: null });
};

export const getHome = async (req, res) => {
    try {
        let profilePic = null;
        let userPreferences = { allergies: [] };

        if (req.user) {
            const profile = await UserProfile.findOne({ userId: req.user.id });
            profilePic = profile?.profilePic;

            const preferences = await UserPreferences.findOne({ userId: req.user.id });
            if (preferences) {
                logger.info(`Allergies: ${preferences.allergies.join(", ")}`);
                userPreferences = preferences;
            }
        }

        res.render("home", {
            title: "Home",
            user: {
                ...req.user,
                profilePic: profilePic,
            },
            userPreferences,
            allergyOptions: ALLERGY_OPTIONS,
        });
    } catch (error) {
        console.error("Error rendering home:", error);
        res.status(500).send("Internal Server Error");
    }
};

export const getRecipe = (req, res) => {
    res.render("recipe", {
        title: "Recipe",
        user: req.user,
    });
};

export const healthCheck = (req, res) => {
    res.status(200).json({ status: "ok" });
};
