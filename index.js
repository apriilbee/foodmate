import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import mealRoutes from "./routes/mealRoutes.js";

const app = express();
const PORT = 3000;

mongoose
    .connect("mongodb://localhost:27017/foodmate")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json()); 
app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(
    session({
        secret: "foodmate-secret",
        resave: false,
        saveUninitialized: true,
    })
);

// Routes
app.use("/", authRoutes);
app.use("/meal", mealRoutes); 
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
