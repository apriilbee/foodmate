import { createGroceryList } from "../controllers/groceryListController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import express from "express";
 
const router = express.Router()
 
router.get('/generate', authenticateJWT, createGroceryList);
// router.get('/:id', authenticateJWT, retrieveGroceryListById);
// router.patch('/:id', authenticateJWT, editGroceryList);
// router.delete('/:id', authenticateJWT, removeGroceryList);
// router.get('/', authenticateJWT, retrieveAllGroceryLists);
 
export default router;