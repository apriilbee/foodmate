import express from "express";
import { getIndex, getHome, healthCheck } from "../controllers/homeController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public index page
router.get("/", getIndex);

// User's dashboard (needs auth)
router.get("/home", authenticateJWT, getHome);

// Health check
router.get("/health", healthCheck);

export default router;
