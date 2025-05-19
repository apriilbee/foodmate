import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { setupAIChatSocket } from "./socket/aiChat.js";

import { ENV } from "./utils/envLoader.js";

import authRoutes from "./routes/authRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import mealPlanRoutes from "./routes/mealPlanRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import groceryListRoutes from "./routes/groceryListRoutes.js";
import groceryRoutes from "./routes/groceryRoutes.js";

import { logger } from "./utils/logger.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = http.createServer(app);
const io = new SocketIOServer(server);
setupAIChatSocket(io);

// MongoDB connection
mongoose
    .connect(ENV.MONGO_URI)
    .then(() => logger.info(`Connected to MongoDB at ${ENV.MONGO_URI}`))
    .catch((err) => logger.error("MongoDB connection error:", err));

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

app.use("/auth", authRoutes);
app.use("/", homeRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/mealPlan", mealPlanRoutes);
app.use("/profile", profileRoutes);
app.use("/api/groceryList", groceryListRoutes);
app.use("/grocery", groceryRoutes);

// Start server
server.listen(ENV.PORT, () => {
    logger.info(`✅ Server running at http://localhost:${ENV.PORT}`);
});