import express from "express";
import { 
    submitFeedback, 
    getAllFeedback, 
    updateFeedback, 
    deleteFeedback, 
    restoreFeedback
  } from "../controllers/feedbackController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js"; 

const router = express.Router();
router.post("/", authenticateJWT, submitFeedback);
router.get("/", authenticateJWT, getAllFeedback);
router.put("/:id", authenticateJWT, updateFeedback);
router.delete("/:id", authenticateJWT, deleteFeedback);
router.put("/restore/:id", authenticateJWT, restoreFeedback);
export default router;
