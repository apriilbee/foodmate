import { getAllGroceryLists } from "../services/groceryListService.js";
import { getProfilePic } from "../services/profilePicService.js";

export const generateGroceryHistory = async (req, res) => {
    const userId = req.user.id;
    const profilePic = await getProfilePic(userId);
    const {ownGroceryListIds, collaboratorListIds} = await getAllGroceryLists(userId);
    return res.render("grocery-history", {
        title : "Grocery History",
        lists : ownGroceryListIds,
        collabs : collaboratorListIds,
        user : {
            ...req.user,
            profilePic : profilePic
        }
    })
}