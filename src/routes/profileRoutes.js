import express from 'express';
import { getProfile, updateProfile, updateDietaryPreferences , deleteAccount, uploadProfilePicture, updateEmail} from '../controllers/profileController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';
import multer from 'multer';
const upload = multer();
import uploadpic from '../utils/multerConfig.js';

const router = express.Router();


// Profile Page
router.get('/', authenticateJWT, getProfile);

//Update Profile
router.post('/update', authenticateJWT, updateProfile);

//Update diet preferences
router.post('/dietpreferences', authenticateJWT, upload.none(),updateDietaryPreferences);

// Delete Account
router.delete('/delete', authenticateJWT, deleteAccount);

// Upload Profile Picture
router.post('/uploadpicture', authenticateJWT, uploadpic.single('profilePic'), uploadProfilePicture);

// update email
router.post('/updateemail', authenticateJWT, updateEmail);


export default router;
