import { getAllGroceryLists } from "../services/groceryListService.js";
import { getProfilePic } from "../services/profilePicService.js";

export const generateGroceryHistory = async (req, res) => {
    const userId = req.user.id;
    const profilePic = await getProfilePic(userId);
    const lists = await getAllGroceryLists(userId);
    return res.render("grocery-history", {
        title : "Grocery History",
        lists : lists,
        user : {
            ...req.user,
            profilePic : profilePic
        }
    })
}