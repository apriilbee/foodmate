import express from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", authenticateJWT, (req, res) => {
  res.render("grocery", {
    title: "Grocery List",
    user: req.user,
  });
});

export default router;
