import GroceryItem from '../models/Grocery.js';

// Show Grocery List
export async function getGroceryList(req, res) {
  try {
    const groceryList = await GroceryItem.find().sort({ createdAt: -1 });
    const successMessage = req.session.success;
    req.session.success = null; // Clear after showing once
    res.render('grocery', { 
      title: 'Grocery List', 
      groceryList, 
      successMessage 
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
}

// Add Grocery Item
export async function addGroceryItem(req, res) {
  try {
    const { name, quantity, unit, mealPlan } = req.body;

    if (!isNaN(unit)) {
      return res.status(400).send("Unit must be a word, not a number.");
    }

    const newItem = new GroceryItem({
      name,
      quantity,
      unit,
      mealPlan,
      bought: false,
    });

    await newItem.save();
    req.session.success = `${name} added successfully!`;
    res.redirect('/grocery');
  } catch (error) {
    res.status(500).send(error.message);
  }
}

// Mark Item as Bought
export async function markItemAsBought(req, res) {
  try {
    const itemId = req.params.id;
    const item = await GroceryItem.findByIdAndUpdate(itemId, { bought: true });
    req.session.success = `${item.name} marked as bought!`;
    res.redirect('/grocery');
  } catch (error) {
    res.status(500).send(error.message);
  }
}

// Delete Grocery Item
export async function deleteGroceryItem(req, res) {
  try {
    const itemId = req.params.id;
    const item = await GroceryItem.findByIdAndDelete(itemId);
    req.session.success = `${item.name} deleted successfully!`;
    res.redirect('/grocery');
  } catch (error) {
    res.status(500).send(error.message);
  }
}

