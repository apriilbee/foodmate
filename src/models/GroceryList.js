import mongoose from "mongoose";
 
const GroceryItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    unit: { type: String, required: true },
    purchased: { type: Boolean, default: false }
});

const AisleGroupSchema = new mongoose.Schema({
    aisle: {type: String, required: true},
    items: [GroceryItemSchema]
})
const GroceryListSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    aisles: [AisleGroupSchema],
}, {
    timestamps: true
});
 
export const GroceryList = mongoose.model('GroceryList', GroceryListSchema);