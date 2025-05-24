import express from "express";
import { getRegister, postRegister, postLogin, verifyEmail } from "../controllers/authController.js";
import { getForgotPassword, postForgotPassword, getResetPassword, postResetPassword} from "../controllers/authController.js";

const router = express.Router();

// LOGIN
router.post("/login", postLogin);

// LOGOUT
router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
});

// VERIFY EMAIL
router.get("/verify", verifyEmail);

// REGISTER
router.get("/register", getRegister);
router.post("/register", postRegister);


// FORGOT & RESET PASSWORD
router.get("/forgot-password", getForgotPassword);
router.post("/forgot-password", postForgotPassword);
router.get("/reset-password/:token", getResetPassword);
router.post("/reset-password/:token", postResetPassword);

export default router;
