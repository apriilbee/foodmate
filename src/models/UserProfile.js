// models/UserProfile.js
import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  email: { type: String, required: true },

  profilePic: {
    type: String,
    default: '/img/profile.svg'
  }
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);
export default UserProfile;
