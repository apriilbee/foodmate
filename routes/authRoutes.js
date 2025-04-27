import express from "express";
import { getRegister, postRegister, postLogin } from "../controllers/authController.js";
import Meal from "../models/Meal.js";
import moment from "moment"; // Use moment.js for date formatting

const router = express.Router();

// INDEX
router.get("/", (req, res) => {
    res.render("index", { title: "Login" });
});

// LOGIN and LOGOUT
router.post("/login", postLogin);
router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log("Logout error:", err);
            return res.send("Error logging out");
        }
        res.redirect("/");
    });
});

// REGISTER
router.get("/register", getRegister);
router.post("/register", postRegister);

// HOME
router.get("/home", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/");
    }
    res.render("home", { title: "Dashboard", user: req.session.user });
});
// ✅ MY MEAL PLAN
router.get("/mealplan", async (req, res) => {
    if (!req.session.user) return res.redirect("/");

    const userId = req.session.user._id;
    const selectedWeek = req.query.week || moment().startOf("isoWeek").format("YYYY-MM-DD");

    // Calculate start and end of the selected week
    const startOfWeek = moment(selectedWeek).startOf("isoWeek");
    const endOfWeek = moment(startOfWeek).endOf("isoWeek");

    try {
        const meals = await Meal.find({
            user: userId,
            date: { 
                $gte: startOfWeek.format("YYYY-MM-DD"),
                $lte: endOfWeek.format("YYYY-MM-DD")
            }
        });

        res.render("mealPlan", {
            title: "My Meal Plan",
            user: req.session.user,
            meals,
            startOfWeek: startOfWeek.format("YYYY-MM-DD"),
            endOfWeek: endOfWeek.format("YYYY-MM-DD"),
            prevWeek: moment(startOfWeek).subtract(1, "week").format("YYYY-MM-DD"),
            nextWeek: moment(startOfWeek).add(1, "week").format("YYYY-MM-DD"),
            moment // 👈 add this line
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading meal plan");
    }
});

// ✅ ADD MEAL
router.post("/meal/add", async (req, res) => {
    try {
        const { recipe_id, date, type } = req.body;

        if (!req.session.user) {
            return res.status(401).send("Unauthorized");
        }

        const newMeal = new Meal({
            user: req.session.user._id,
            recipe_id,  // Just store the recipe_id directly for now
            date,
            type
        });

        await newMeal.save();
        res.status(200).send("Meal added successfully!");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error saving meal");
    }
});
// DELETE MEAL
router.post("/meal/delete", async (req, res) => {
    try {
        const { mealId } = req.body;

        if (!req.session.user) {
            return res.status(401).send("Unauthorized");
        }

        await Meal.findOneAndDelete({
            _id: mealId,
            user: req.session.user._id
        });
        res.status(200).send("Meal deleted");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting meal");
    }
});

export default router;
