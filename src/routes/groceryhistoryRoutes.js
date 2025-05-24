import express from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { generateGroceryHistory } from "../controllers/groceryHistoryController.js";
const router = express.Router();

router.get("/grocery-history", authenticateJWT, generateGroceryHistory);

export default router;
