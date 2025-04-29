import User from '../models/User.js';
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
        title: "Profile Settings",   // 👈 Add title here
        user: req.session.user, 
        message: null 
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      res.render('profile', { 
        title: "Profile Settings",   // 👈 Even in error case, pass title
        user: req.session.user, 
        message: 'Failed to load profile settings' 
      });
    }
  };
  

// Update profile password
export const updateProfile = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const userId = req.session.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.redirect('/auth/login');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.render('profile', { user, message: 'Current password is incorrect.' });
    }

    if (newPassword !== confirmPassword) {
      return res.render('profile', { user, message: 'New passwords do not match.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.render('profile', { user, message: 'Password updated successfully!' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.render('profile', { user: {}, message: 'Failed to update profile.' });
  }
};

