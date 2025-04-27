import Meal from "../models/Meal.js";

// ADD MEAL
export const addMeal = async (req, res) => {
  const { recipe_id, date, type } = req.body;

  if (!req.session.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const newMeal = new Meal({
      user: req.session.user._id,
      recipe_id,
      date,
      type
    });

    await newMeal.save();
    res.status(200).json({ success: true, message: "Meal added successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error while adding meal" });
  }
};

// GET MEALS FOR A WEEK
export const getMealsForWeek = async (req, res) => {
  const { user_id } = req.params;
  const { week } = req.query; // e.g., 2025-04-21

  try {
    const startDate = new Date(week);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    const meals = await Meal.find({
      user: user_id,
      date: { $gte: week, $lte: endDate.toISOString().split("T")[0] }
    });

    res.json(meals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching meals" });
  }
};

// DELETE MEAL
export const deleteMeal = async (req, res) => {
  const { mealId } = req.body;

  if (!req.session.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const meal = await Meal.findById(mealId);

    if (!meal) {
      return res.status(404).json({ success: false, message: "Meal not found" });
    }

    if (meal.user.toString() !== req.session.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    await Meal.findByIdAndDelete(mealId);

    res.status(200).json({ success: true, message: "Meal deleted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error while deleting meal" });
  }
};
