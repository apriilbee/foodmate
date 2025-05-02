import express from 'express';
import { getProfile, updateProfile, updateDietaryPreferences , deleteAccount, uploadProfilePicture} from '../controllers/profileController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';
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

// Define storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const filename = Date.now() + ext;
      cb(null, filename);
    }
  });
  
  const uploadpic = multer({ storage: storage });

// Upload Profile Picture
router.post('/profile/uploadpicture', authenticateJWT, uploadpic.single('profilePic'), uploadProfilePicture);


export default router;
