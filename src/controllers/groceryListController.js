import { generateGroceryList, getAllGroceryLists, getGroceryList, updateGroceryList, addCollaboratorToGroceryList } from "../services/groceryListService.js";
import { getProfilePic } from "../services/profilePicService.js";
export const createGroceryList = async (req, res) => {
    try {
        const userId = req.user.id;
        const { start, end, force } = req.body;
        const list = await generateGroceryList(userId, start, end, force);

        return res.status(200).json( { groceryList : list} );
    }
    catch (err) {
        return res.status(400).json( {error : err.message} )
    }
}

export const retrieveAllGroceryLists = async (req, res) => {
    try {
        const userId = req.user.id;

        const lists = await getAllGroceryLists(userId);

        return res.status(200).json( {lists} );
    }
    catch (err) {
        return res.status(400).json( {error : err.message} )
    }
}

export const retrieveGroceryListById = async (req, res) => {
    try {
        const userId = req.user.id;
        const groceryListId = req.params.id;

        const {list, owned, owner} = await getGroceryList(userId, groceryListId);

        return res.status(200).json( {list, owned, owner} );
    }
    catch (err) {
        return res.status(400).json( {error: err.message} );
    }
}

export const editGroceryList = async (req, res) => {
    try {
        const userId = req.user.id;
        const groceryListId = req.params.id;
        const updates = req.body.updates;

        const updatedList = await updateGroceryList(groceryListId, updates, userId);

        return res.status(200).json( {updatedList} );
    }
    catch (err) {
        return res.status(400).json( {error: err.message} );
    }
}

export const renderGenerateGroceryPage = async (req, res) => {
    try {
        const userId = req.user.id;
        const profilePic = await getProfilePic(userId);
        return res.render("grocery", {
            title: "Generate Grocery List",
            user : {
                ...req.user,
                profilePic : profilePic
            }
        })
    }
    catch {
        return res.redirect('/');
    }
}

export const inviteCollaboratorToList = async (req, res) => {
    try {
        const groceryListId = req.params.id;
        const { email } = req.body;

        const message = await addCollaboratorToGroceryList(groceryListId, email);

        return res.status(200).json( {message : message} )
    }
    catch (err) {
        return res.status(400).json( {error: err.message} )
    }
}