import jwt from "jsonwebtoken";
import { ENV } from "../utils/envLoader.js";

export const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token;

    if (token) {
        jwt.verify(token, ENV.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Forbidden" });
            }
            req.user = user;
            next();
        });
    } else {
        res.redirect("/");
    }
};
