import { getAllGroceryLists } from "../services/groceryListService.js";

export const generateGroceryHistory = async (req, res) => {
    console.log(req.user)
    const userId = req.user.id;
    const lists = await getAllGroceryLists(userId);
    return res.render("grocery-history", {
        title : "Grocery History",
        lists : lists,
        user : req.user
    })
}

