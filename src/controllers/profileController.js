import User from '../models/User.js';
import UserPreferences from '../models/UserPreferences.js';
import bcrypt from 'bcryptjs';

export const getProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      const preferences = await UserPreferences.findOne({ userId: user._id });
  
      res.render('profile', {
        title: "Profile Settings",
        user: {
          ...user.toObject(),
          dietaryPreferences: preferences?.dietaryPreferences || [],
          allergies: preferences?.allergies || []
        },
        message: null
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      res.render('profile', {
        title: "Profile Settings",
        user: req.user,
        message: 'Failed to load profile settings'
      });
    }
  };
  
export const updateProfile = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized. Please login again." });
    }

    const user = await User.findById(req.user.id); 
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    let updated = false;

    // Password update logic
    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ success: false, message: "All password fields must be filled." });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: "Current password is incorrect." });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({ success: false, message: "New passwords do not match." });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
      }

      user.password = newPassword;
      updated = true;
    }

    if (!updated) {
      return res.status(400).json({ success: false, message: "No changes detected." });
    }

    await user.save();
    return res.status(200).json({ success: true, message: "Password updated successfully." });

  } catch (err) {
    console.error("Error updating profile:", err.message, err.stack);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const updateDietaryPreferences = async (req, res) => {
  try {
    const userId = req.user?.id; 
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Please login again.' });
    }

    const { dietary, dietaryOther, allergies, allergyOther } = req.body;

    let updatedDietary = Array.isArray(dietary) ? dietary : dietary ? [dietary] : [];
    if (dietaryOther?.trim()) updatedDietary.push(dietaryOther.trim());

    let updatedAllergies = Array.isArray(allergies) ? allergies : allergies ? [allergies] : [];
    if (allergyOther?.trim()) updatedAllergies.push(allergyOther.trim());

    await UserPreferences.findOneAndUpdate(
      { userId },
      {
        dietaryPreferences: updatedDietary,
        allergies: updatedAllergies
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, message: 'Preferences updated successfully.' });

  } catch (err) {
    console.error('Error updating preferences:', err.message, err.stack);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
