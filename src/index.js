import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";

import { logger } from "./utils/logger.js";

const app = express();
const PORT = 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/foodmate";

mongoose
    .connect(ENV.MONGO_URI)
    .then(() => logger.info(`Connected to MongoDB at ${MONGO_URI}`))
    .catch((err) => logger.error("MongoDB connection error:", err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(
    session({
        secret: "foodmate-secret",
        resave: false,
        saveUninitialized: true,
    })
);

app.use("/auth", authRoutes);
app.use("/", homeRoutes);

app.listen(PORT, () => {
    logger.info(`Server running at http://localhost:${PORT}`);
});
