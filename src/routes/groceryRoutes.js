import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  const dummyGroceryData = [
    {
      category: "Vegetables",
      items: [
        { name: "Tomatoes", quantity: "2", unit: "Kg" },
        { name: "Spinach", quantity: "1", unit: "Bunch" },
        { name: "Broccoli", quantity: "1", unit: "Kg" },
      ],
    },
    {
      category: "Dairy",
      items: [
        { name: "Milk", quantity: "1", unit: "Liters" },
        { name: "Cheese", quantity: "1", unit: "Grams" },
      ],
    },
    {
      category: "Bakery",
      items: [
        { name: "Whole Wheat Bread", quantity: "1", unit: "Loaf" },
      ],
    },
  ];

  res.render("grocery", {
    title: "Grocery List",
    user: null, 
    groceryData: dummyGroceryData
  });
});

export default router;
