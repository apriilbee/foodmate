import express from 'express';
import { getProfile } from '../controllers/profileController.js';

const router = express.Router();

// Profile Page
router.get('/profile', getProfile);

// Update Profile
//router.post('/profile/update', updateProfile);

export default router;
