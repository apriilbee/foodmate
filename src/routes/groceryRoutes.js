import express from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { renderGenerateGroceryPage } from "../controllers/groceryListController.js";
const router = express.Router();

router.get("/", authenticateJWT, renderGenerateGroceryPage)

export default router;