import express from "express";
import { createMealPlan, getWeeklyMealPlan, getMealPlan  } from "../controllers/mealPlanController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { getWeeklyMeals } from "../services/mealPlanService.js";
import moment from "moment";
import { deleteMealsByDate } from "../controllers/mealPlanController.js";

const router = express.Router();

router.post("/", authenticateJWT, createMealPlan);
router.get("/", authenticateJWT, async (req, res) => {
    try {
        const userId = req.user.id;
        const start = req.query.week || moment().startOf("week").format("YYYY-MM-DD");

        const meals = await getWeeklyMeals({ userId, start });

        const startOfWeek = moment(start).startOf("week").toDate();
        const endOfWeek = moment(startOfWeek).add(6, "days").toDate();
        const prevWeek = moment(startOfWeek).subtract(7, "days").format("YYYY-MM-DD");
        const nextWeek = moment(startOfWeek).add(7, "days").format("YYYY-MM-DD");

        res.render("mealPlan", {
            title: "My Meal Plan",
            meals,
            startOfWeek,
            endOfWeek,
            prevWeek,
            nextWeek,
            moment,
            user: req.user
        });
    } catch (err) {
        console.error("Error rendering meal plan view:", err.message);
        res.status(500).send("Error loading meal plan");
    }
});

router.get("/week", authenticateJWT, getWeeklyMealPlan);
router.get("/api", authenticateJWT, getMealPlan);
router.delete("/", authenticateJWT, deleteMealsByDate);

export default router;
