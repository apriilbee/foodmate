import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.render("grocery", {
    title: "Grocery List",
    user: null  // or pass a fake user object if needed
  });
});

export default router;
