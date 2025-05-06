import { generateGroceryList, getAllGroceryLists, getGroceryList, updateGroceryList } from "../services/groceryListService.js";

export const createGroceryList = async (req, res) => {
    try {
        const userId = req.user.id;
        const { start, end } = req.body;

        const list = await generateGroceryList(userId, start, end);

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

        const list = await getGroceryList(userId, groceryListId);

        return res.status(200).json( {list} );
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