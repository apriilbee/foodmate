import express from 'express';
import {
  getGroceryList,
  addGroceryItem,
  markItemAsBought,
  deleteGroceryItem
} from '../controllers/groceryController.js';

const router = express.Router();

router.get('/grocery', getGroceryList);
router.post('/grocery/add', addGroceryItem);
router.post('/grocery/buy/:id', markItemAsBought);
router.post('/grocery/delete/:id', deleteGroceryItem);

export default router;

