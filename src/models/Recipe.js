import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    image: { type: String },
    imageType: { type: String },
    title: { type: String, required: true },
    readyInMinutes: { type: Number },
    servings: { type: Number },
    sourceUrl: { type: String },
    sourceName: { type: String },
    
    vegetarian: { type: Boolean },
    vegan: { type: Boolean },
    glutenFree: { type: Boolean },
    dairyFree: { type: Boolean },
  
    extendedIngredients: { type: [Object] },
    nutrition: { type: Object },            
    summary: { type: String },
  
    cuisines: { type: [String] },
    dishTypes: { type: [String] },
    diets: { type: [String] },
  
    instructions: { type: String },
    analyzedInstructions: { type: [Object] },
}, { timestamps: true });

export const Recipe = mongoose.model('Recipe', recipeSchema);