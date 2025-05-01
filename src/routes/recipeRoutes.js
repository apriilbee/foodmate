import express from "express";
import { getRecipes, getRecipeById } from "../controllers/recipeController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/recipes", authenticateJWT, getRecipes);
router.get("/recipes/:id", authenticateJWT, getRecipeById);

export default router;
