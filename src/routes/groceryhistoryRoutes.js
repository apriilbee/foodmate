import express from "express";
const router = express.Router();

router.get("/grocery-history", (req, res) => {
  const groceryHistory = [
    {
      dateRange: "April 1 - April 8",
      items: [
        "Broccoli – 2 heads",
        "Chicken Breast – 1.5 kg",
        "Eggs – 1 dozen",
        "Whole Wheat Bread – 1 loaf",
        "Cheddar Cheese – 200g",
        "Bananas – 6 pieces",
        "Milk – 2 liters",
        "Red Onions – 4 pieces",
        "Cherry Tomatoes – 1 punnet",
        "Olive Oil – 500ml",
      ],
      logs: [
        "09:14 AM: Alice added Broccoli (2 heads)",
        "09:15 AM: Alice added Chicken Breast (1.5 kg)",
        "09:18 AM: Bob edited Chicken Breast to 2 kg",
        "09:20 AM: Carol added Bananas (6 pieces)",
        "09:21 AM: Bob deleted Eggs",
        "09:23 AM: Alice added Olive Oil (500ml)",
        "09:25 AM: Carol edited Milk from 1L to 2L",
        "09:28 AM: Bob added Cheddar Cheese (200g)",
        "09:30 AM: Alice added Whole Wheat Bread (1 loaf)",
        "09:31 AM: Carol edited Cherry Tomatoes to 2 punnets",
      ],
    },
    {
      dateRange: "April 15 - April 23",
      items: [
        "Potatoes – 1 kg",
        "Apples – 5 pieces",
        "Yogurt – 1 tub",
        "Brown Bread – 1 loaf",
        "Butter – 250g",
      ],
      logs: [
        "10:10 AM: Alice added Potatoes (1 kg)",
        "10:15 AM: Bob added Apples (5 pieces)",
        "10:18 AM: Carol added Yogurt (1 tub)",
        "10:20 AM: Bob added Brown Bread (1 loaf)",
        "10:22 AM: Alice added Butter (250g)",
      ],
    },
  ];

  res.render("grocery-history", {
    title: "Grocery History",
    groceryHistory,
    user: null // or user: req.user if you're using auth
  });
  
  });

export default router;
