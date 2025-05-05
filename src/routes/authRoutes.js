import express from "express";
import { getRegister, postRegister, postLogin } from "../controllers/authController.js";

const router = express.Router();

// LOGIN
router.post("/login", postLogin);

// LOGOUT
router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
});

// REGISTER
router.get("/register", getRegister);
router.post("/register", postRegister);

export default router;
