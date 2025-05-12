import UserProfile from '../models/UserProfile.js';

export const getIndex = (req, res) => {
    res.render("index", { title: "Login", error: null });
};
/*
export const getHome = (req, res) => {
    res.render("home", {
        title: "Home",
        user: req.user,
    });
};
*/

export const getHome = async (req, res) => {
    try {
        let profilePic = null;

        if (req.user) {
            const profile = await UserProfile.findOne({ userId: req.user.id });
            profilePic = profile?.profilePic;
        }

        res.render("home", {
            title: "Home",
            user: {
                ...req.user,
                profilePic: profilePic 
            }
        });
    } catch (error) {
        console.error("Error rendering home:", error);
        res.status(500).send("Internal Server Error");
    }
};

export const getRecipe = (req, res) => {
    res.render("recipe", {
        title: "Recipe",
        user: req.user
    })
}

export const healthCheck = (req, res) => {
    res.status(200).json({ status: "ok" });
};
