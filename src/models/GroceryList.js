import mongoose from "mongoose";
 
const GroceryItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    unit: { type: String, required: false },
    purchased: { type: Boolean, default: false }
});

const AisleGroupSchema = new mongoose.Schema({
    aisle: {type: String, required: true},
    items: [GroceryItemSchema]
})

const LogSchema = new mongoose.Schema({
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
})

const GroceryListSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    aisles: [AisleGroupSchema],
    meals: [{ type: Number }],
    logs: [LogSchema],
}, {
    timestamps: true
});
 
GroceryListSchema.index({ collaborators: 1});

export const GroceryList = mongoose.model('GroceryList', GroceryListSchema);