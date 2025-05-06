import { createGroceryList, retrieveAllGroceryLists, retrieveGroceryListById, editGroceryList } from "../controllers/groceryListController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import express from "express";
 
const router = express.Router()
 
router.post('/generate', authenticateJWT, createGroceryList);
router.get('/:id', authenticateJWT, retrieveGroceryListById);
router.patch('/:id', authenticateJWT, editGroceryList);
router.get('/all', authenticateJWT, retrieveAllGroceryLists);
 
export default router;