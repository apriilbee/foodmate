import express from "express";
import { 
    submitFeedback, 
    getAllFeedback, 
    updateFeedback, 
    deleteFeedback 
  } from "../controllers/feedbackController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js"; 

const router = express.Router();
router.post("/", authenticateJWT, submitFeedback);
router.get("/", authenticateJWT, getAllFeedback);
router.put("/:id", authenticateJWT, updateFeedback);
router.delete("/:id", authenticateJWT, deleteFeedback);
export default router;
