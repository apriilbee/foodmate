import express from 'express';
import { getProfile, updateProfile, updateDietaryPreferences } from '../controllers/profileController.js';

const router = express.Router();

// Profile Page
router.get('/profile', getProfile);

//Update Profile
router.post('/profile', updateProfile);

//Update Profile
router.post('/profile/dietpreferences', updateDietaryPreferences);


export default router;
