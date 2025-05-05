import { GroceryList } from "../models/GroceryList.js";
import { generateGroceryList, getAllGroceryLists } from "../services/groceryListService.js";

export const createGroceryList = async (req, res) => {
    try{
        const userId = req.user.id;
        const { start, end } = req.query;

        const list = await generateGroceryList(userId, start, end);

        return res.status(200).json( { groceryList : list} );
    }
    catch (err) {
        return res.status(400).json( {error : err.message} )
    }
}

export const retrieveAllGroceryLists = async (req, res) => {
    try{
        const userId = req.user.id;

        const lists = await getAllGroceryLists(userId);

        return res.status(200).json( {lists} );
    }
    catch (err) {
        return res.status(400).json( {error : err.message} )
    }
}