import express from 'express';
import { getProfile, updateProfile, updateDietaryPreferences , deleteAccount} from '../controllers/profileController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

import multer from 'multer';
const upload = multer();

const router = express.Router();

// Profile Page
router.get('/profile', authenticateJWT, getProfile);

//Update Profile
router.post('/profile/update', authenticateJWT, updateProfile);

//Update diet preferences
router.post('/profile/dietpreferences', authenticateJWT, upload.none(),updateDietaryPreferences);

// Delete Account
router.delete('/profile/delete', authenticateJWT, deleteAccount);

export default router;
