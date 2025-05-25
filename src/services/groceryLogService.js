import { GroceryList } from "../models/GroceryList.js";
import { getSocketIO } from "../utils/socketContext.js";



export const addGroceryLog = async (groceryId, message) => {
    const logEntry = {message, timestamp: new Date() };

    const updatedList = await GroceryList.findByIdAndUpdate(
        groceryId,
        { $push: { logs: logEntry } },
        { new: true}
    )

    if (updatedList) {
        const io = getSocketIO();
        io.to(groceryId).emit("logMessage", {logEntry, groceryId});
    }

    return updatedList;
} 