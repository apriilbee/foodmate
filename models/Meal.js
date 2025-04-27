import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }, // CHANGE HERE
    date: String,       // Format: "YYYY-MM-DD"
    type: String        // Breakfast, Lunch, Dinner
  });
  
const Meal = mongoose.model("Meal", mealSchema);
export default Meal;
