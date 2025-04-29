import mongoose from 'mongoose';

// Define the grocery item schema
const grocerySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,  // Name of the grocery item
  },
  quantity: {
    type: Number,
    required: true,  // Quantity of the grocery item
  },
  unit: {
    type: String,
    required: true,  // Unit of measurement (e.g., kg, lb)
  },
  bought: {
    type: Boolean,
    default: false,  // Initially, the item is marked as not bought
  }
});

// Create the model from the schema
const Grocery = mongoose.model('Grocery', grocerySchema);
export default Grocery;  // Export the model for use in the controller
