export const TAG_MAPPINGS = {
    // Diets
    Vegan: { param: "diet", value: "vegan" },
    Vegetarian: { param: "diet", value: "vegetarian" },
    Pescatarian: { param: "diet", value: "pescatarian" },
    "Low-Carb / Keto": { param: "diet", value: "ketogenic" },
    "High-Protein": { param: "diet", value: "high-protein" },
    "Low-Fat": { param: "diet", value: "low-fat" },
    Paleo: { param: "diet", value: "paleo" },
    "Plant-Based": { param: "diet", value: "vegan" },

    // Intolerances
    "Dairy-Free": { param: "intolerances", value: "dairy" },
    "Gluten-Free": { param: "intolerances", value: "gluten" },
    "Nut-Free": { param: "intolerances", value: "peanut,tree nut" },
    "Soy-Free": { param: "intolerances", value: "soy" },

    // Nutrition Constraints
    "Sugar-Free": { param: "nutrition", key: "nutrition.maxSugar", value: 0 },
    "Low Sugar": { param: "nutrition", key: "nutrition.maxSugar", value: 5 },
    "Low-Sodium": { param: "nutrition", key: "nutrition.maxSodium", value: 140 },
    "Low Calorie": { param: "nutrition", key: "nutrition.maxCalories", value: 400 },

    // Special Cases
    "No Red Meat": { param: "excludeIngredients", value: "beef,pork,lamb" },
    Whole30: { param: "keyword", value: "whole30" },
    Mediterranean: { param: "keyword", value: "mediterranean" },

    // (Allergies will be added dynamically later)
};

export const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snacks", "Dessert"];
