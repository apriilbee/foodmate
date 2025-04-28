export const TAG_MAPPINGS = {
    Vegan: { param: "diet", value: "vegan" },
    Pescatarian: { param: "diet", value: "pescetarian" },
    "Low-Carb / Keto": { param: "diet", value: "keto" },

    "Dairy-Free": { param: "intolerances", value: "dairy" },
    "Gluten-Free": { param: "intolerances", value: "gluten" },
    "Sugar-Free": { param: "intolerances", value: "sugar" },
    "Nut-Free": { param: "intolerances", value: "nuts" },
    "Soy-Free": { param: "intolerances", value: "soy" },

    "Low-Fat": { param: "maxFat", value: 10 },
    "Low-Sodium": { param: "maxSodium", value: 140 },
    "High-Protein": { param: "minProtein", value: 30 },
};

export const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snacks", "Dessert"];
