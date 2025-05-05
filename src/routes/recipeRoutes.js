import express from "express";
import { getRecipes, getRecipeById, searchRecipes } from "../controllers/recipeController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/search", authenticateJWT, searchRecipes);
router.get("/:id", authenticateJWT, getRecipeById);
router.get("/", authenticateJWT, getRecipes);

export default router;
