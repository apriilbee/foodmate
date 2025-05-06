import User from '../models/User.js';
import UserPreferences from '../models/UserPreferences.js';
import UserProfile from '../models/UserProfile.js';
import bcrypt from 'bcryptjs';

export const getUserProfileData = async (userId) => {
  const user = await User.findById(userId);
  const preferences = await UserPreferences.findOne({ userId });
  const profile = await UserProfile.findOne({ userId });
  
  return {
    ...user.toObject(),
    dietary: preferences?.dietaryPreferences || [],
    allergies: preferences?.allergies || [],
    profilePic: profile?.profilePic ,
    email: profile?.email 
  };
};

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
export const updateUserPassword = async (userId, currentPassword, newPassword, confirmPassword) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new Error('All password fields must be filled');
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new Error('Current password is incorrect');
  if (newPassword !== confirmPassword) throw new Error('New passwords do not match');
  if (newPassword.length < 8) throw new Error('Password must be at least 8 characters');
  if (!passwordRegex.test(newPassword)) {
    throw new Error('Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, and one symbol');
  }

  user.password = newPassword;
  await user.save();
};

export const updateUserPreferences = async (userId, dietary, allergies, dietaryOther, allergyOther) => {
  const formattedDietary = Array.isArray(dietary) ? dietary : (dietary ? [dietary] : []);
  const formattedAllergies = Array.isArray(allergies) ? allergies : (allergies ? [allergies] : []);

  if (dietaryOther?.trim()) formattedDietary.push(dietaryOther.trim());
  if (allergyOther?.trim()) formattedAllergies.push(allergyOther.trim());

  return await UserPreferences.findOneAndUpdate(
    { userId },
    {
      dietary: formattedDietary.map(d => d.trim()).filter(Boolean),
      allergies: formattedAllergies.map(a => a.trim()).filter(Boolean)
    },
    { upsert: true, new: true }
  );
};

export const deleteUserAccount = async (userId) => {
  return await User.findByIdAndDelete(userId);
};

export const updateProfilePic = async (userId, file) => {
  if (!file) throw new Error('No file uploaded');

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.mimetype)) throw new Error('Invalid image format');

  const profilePicPath = `/uploads/${file.filename}`;

  await UserProfile.findOneAndUpdate(
    { userId },
    { profilePic: profilePicPath },
    { new: true,  upsert: true}
  );

  return profilePicPath;
};

export const changeEmailInProfile = async (userId, newEmail, currentPassword) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new Error('Incorrect current password');

  const existingEmailUserProfile = await UserProfile.findOne({ email: newEmail });
  if (existingEmailUserProfile) throw new Error('Email already in use in user profile');

  const userProfile = await UserProfile.findOne({ userId });
  if (!userProfile) throw new Error('User profile not found');

  userProfile.email = newEmail;
  await userProfile.save();

  return userProfile;
};


