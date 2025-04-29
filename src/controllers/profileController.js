import User from '../models/User.js';
import validator from 'validator'; 
import bcrypt from 'bcryptjs';

export const getProfile = async (req, res) => {
    try {
      if (!req.session.user) {
        return res.redirect('/auth/login');
      }
  
      const userId = req.session.user._id;
      const user = await User.findById(userId);
  
      if (!user) {
        return res.redirect('/auth/login');
      }
  
      res.render('profile', { 
        title: "Profile Settings",   
        user: req.session.user, 
        message: null 
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      res.render('profile', { 
        title: "Profile Settings",   
        user: req.session.user, 
        message: 'Failed to load profile settings' 
      });
    }
  };
  
// Update user profile settings
export const updateProfile = async (req, res) => {
    try {
      const userId = req.session.user._id;;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized. Please login again.' });
      }
  
      const { name, email, currentPassword, newPassword, confirmPassword } = req.body;
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      // --- Field Updates ---
      let updated = false; // track if anything was updated
  
      // Update name if provided and different
      if (name && name.trim() && name !== user.name) {
        user.name = name.trim();
        updated = true;
      }
  
      // Update email if provided and different
      if (email && email.trim() && email !== user.email) {
        if (!validator.isEmail(email)) {
          return res.status(400).json({ error: 'Invalid email format.' });
        }
        user.email = email.trim();
        updated = true;
      }
  
      // --- Password Update ---
      if (currentPassword || newPassword || confirmPassword) {
        if (!currentPassword || !newPassword || !confirmPassword) {
          return res.status(400).json({ error: 'All password fields must be filled.' });
        }
  
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
          return res.status(400).json({ error: 'Current password is incorrect.' });
        }
  
        if (newPassword !== confirmPassword) {
          return res.status(400).json({ error: 'New passwords do not match.' });
        }
  
        // Optional: Check password strength
        if (newPassword.length < 6) {
          return res.status(400).json({ error: 'Password must be at least 6 characters.' });
        }
  
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        updated = true;
      }
  
      // If nothing was updated
      if (!updated) {
        return res.status(400).json({ error: 'No changes detected.' });
      }
  
      await user.save();
  
      // update session user (so reload shows fresh info immediately)
      req.session.user = {
        _id: user._id,
        name: user.name,
        email: user.email
      };
  
      res.status(200).json({ message: 'Profile updated successfully.' });
      //return res.redirect('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
};
export const updateDietaryPreferences = async (req, res) => {
    try {
      const userId = req.session.user._id;
  
      // Ensure the user is logged in
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized. Please log in again.' });
      }
  
      const { dietary, dietaryOther, allergies, allergyOther } = req.body;
  
      // Find the user from the database
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      // Initialize empty arrays for dietary preferences and allergies
      let updatedDietary = [];
      let updatedAllergies = [];
  
      // Handle dietary preferences
      if (Array.isArray(dietary)) {
        updatedDietary = dietary;  // If multiple checkboxes are selected
      } else if (dietary) {
        updatedDietary = [dietary];  // If one checkbox is selected
      }
  
      // Add 'other' dietary preference if provided
      if (dietaryOther && dietaryOther.trim()) {
        updatedDietary.push(dietaryOther.trim());
      }
  
      // Handle allergies
      if (Array.isArray(allergies)) {
        updatedAllergies = allergies;  // If multiple checkboxes are selected
      } else if (allergies) {
        updatedAllergies = [allergies];  // If one checkbox is selected
      }
  
      // Add 'other' allergy if provided
      if (allergyOther && allergyOther.trim()) {
        updatedAllergies.push(allergyOther.trim());
      }
  
      // Update the user's dietary preferences and allergies
      user.dietaryPreferences = updatedDietary;
      user.allergies = updatedAllergies;
  
      // Save the updated user data to the database
      await user.save();
  
      // Update the session with the latest data
      req.session.user = {
        _id: user._id,
        name: user.name,
        email: user.email,
        dietaryPreferences: user.dietaryPreferences,
        allergies: user.allergies
      };
  
      // Respond with a success message
      res.status(200).json({ message: 'Dietary preferences and allergies updated successfully.' });
  
    } catch (error) {
      console.error('Error updating dietary preferences:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
};
  