import { getAllGroceryLists } from "../services/groceryListService.js";

export const generateGroceryHistory = async (req, res) => {
    const userId = req.user.id;
    const lists = await getAllGroceryLists(userId);
    return res.render("grocery-history", {
        title : "Grocery History",
        lists : lists,
        user : req.user
    })
}

