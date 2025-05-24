import { GroceryList } from "../models/GroceryList.js";
import { ioSocket } from "../index.js";

export const addGroceryLog = async (groceryId, message) => {
    const logEntry = {message, timestamp: new Date() };

    const updatedList = await GroceryList.findByIdAndUpdate(
        groceryId,
        { $push: { logs: logEntry } },
        { new: true}
    )

    if (updatedList) {
        ioSocket.to(groceryId).emit("logMessage", logEntry);
    }

    return updatedList;
} 