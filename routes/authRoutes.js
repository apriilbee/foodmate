import express from "express";
import { getRegister, postRegister, postLogin } from "../controllers/authController.js";

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
            console.log("Logout error:", err);
            return res.send("Error logging out");
        }
        res.redirect("/");
    });
});

// REGISTER
router.get("/register", getRegister);
router.post("/register", postRegister);

// HOME
router.get("/home", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/");
    }
    res.render("home", { title: "Dashboard", user: req.session.user });
});

export default router;
