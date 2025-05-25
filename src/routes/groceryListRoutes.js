import { createGroceryList, retrieveAllGroceryLists, retrieveGroceryListById, editGroceryList, inviteCollaboratorToList } from "../controllers/groceryListController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import express from "express";
 
const router = express.Router()
 
router.post('/generate', authenticateJWT, createGroceryList);
router.get('/:id', authenticateJWT, retrieveGroceryListById);
router.patch('/:id', authenticateJWT, editGroceryList);
router.post('/:id/collaborators', authenticateJWT, inviteCollaboratorToList);
router.get('/all', authenticateJWT, retrieveAllGroceryLists);
 
export default router;