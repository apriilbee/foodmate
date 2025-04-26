import express from "express";
import { getRegister, postRegister, postLogin } from "../controllers/authController.js";
import { logger } from "../utils/logger.js";

const router = express.Router();

// INDEX
router.get("/", (req, res) => {
    res.render("index", { title: "Login" });
});

// LOGIN and LOGOUT
router.post("/login", postLogin);
router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            logger.info("Logout error:", err);
            return res.send("Error logging out");
        }
        res.redirect("/");
    });
});

// REGISTER
router.get("/register", getRegister);
router.post("/register", postRegister);

export default router;
