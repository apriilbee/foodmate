import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

import { ENV } from "./utils/envLoader.js";

import authRoutes from "./routes/authRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";
import profileRoutes from './routes/profileRoutes.js'; 
import recipeRoutes from "./routes/recipeRoutes.js";
import mealPlanRoutes from "./routes/mealPlanRoutes.js";

import { logger } from "./utils/logger.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB connection
mongoose
    .connect(ENV.MONGO_URI)
    .then(() => logger.info(`Connected to MongoDB at ${ENV.MONGO_URI}`))
    .catch((err) => logger.error("MongoDB connection error:", err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));
app.use('/uploads', express.static('public/uploads'));
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

app.use("/auth", authRoutes);
app.use("/", homeRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/mealPlan", mealPlanRoutes);

// Start server
app.listen(ENV.PORT, () => {
    logger.info(`Server running at http://localhost:${ENV.PORT}`);
});
