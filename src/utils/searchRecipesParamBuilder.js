export const searchRecipesParamBuilder = (category, tags) => {
    const params = new URLSearchParams();

    if (category) {
        params.append("cuisine", category.toLowerCase());
    }

    const tagsArray = tags ? tags.split(",") : [];

    tagsArray.forEach((tag) => {
        switch (tag.trim()) {
            case "Vegan":
                params.append("diet", "vegan");
                break;
            case "Dairy-Free":
                params.append("intolerances", "dairy");
                break;
            case "Pescatarian":
                params.append("diet", "pescetarian");
                break;
            case "Low-Carb / Keto":
                params.append("diet", "ketogenic");
                break;
            case "Low-Fat":
                params.append("maxFat", 10);
                break;
            case "High-Protein":
                params.append("minProtein", 20);
                break;
            // You can add more mapping if needed
        }
    });

    return params;
};
