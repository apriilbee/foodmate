import express from 'express';
import { getProfile, updateProfile, updateDietaryPreferences } from '../controllers/profileController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';


const router = express.Router();

// Profile Page
router.get('/profile', authenticateJWT, getProfile);

//Update Profile
router.post('/profile/update', authenticateJWT, updateProfile);

//Update diet preferences
router.post('/profile/dietpreferences', authenticateJWT, updateDietaryPreferences);

export default router;
