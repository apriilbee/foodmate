import { loginUser, registerUser, verifyEmailToken } from "../services/authService.js";
import { logger } from "../utils/logger.js";
import validator from "validator";
import { requestPasswordReset, resetPassword } from "../services/authService.js";
import User from "../models/User.js";


export const postLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await loginUser(email, password);
        if (!result) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        res.cookie("token", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 15 * 60 * 1000,
        });

        return res.status(200).json({ redirectUrl: "/home" });
    } catch (error) {
        logger.error("Login error:", error);

        // Send the actual error message back to the frontend as JSON
        return res.status(400).json({
            message: error.message || "Login failed.",
        });
    }
};
export const getRegister = (req, res) => {
    res.render("register", { title: "Register" });
};

export const postRegister = async (req, res) => {
    const { email, password } = req.body;
    const username = email.split("@")[0];

    try {
        const isStrong = validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        });

        if (!isStrong) {
            return res.status(400).json({
                message: "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.",
            });
        }

        await registerUser(email, password, username);
        res.status(201).json({ redirectUrl: "/?registered=true" });
    } catch (error) {
        logger.error("Register error:", error);
        res.status(400).json({ message: error.message || "Registration failed." });
    }
};

export const verifyEmail = async (req, res) => {
    const { token } = req.query;

    try {
        const verifiedEmail = await verifyEmailToken(token);
        res.redirect(`/?verified=true&email=${encodeURIComponent(verifiedEmail)}`);
    } catch (err) {
        logger.error("Email verification error:", err);
        res.status(400).send(err.message || "Server error.");
    }
};

export const getForgotPassword = (req, res) => {
    res.render("forgotpassword", {
        message: null,
        messageType: null,
    });
};
//  Send password reset email
export const postForgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return  res.render("forgotpassword", {
            message: "Email is required",
            messageType: "error",
          });
      }
      await requestPasswordReset(email);
      res.render("forgotpassword", {
        message: "Password reset email sent if email is registered",
        messageType: "success",
    });
    } catch (error) {
        res.render("forgotpassword", {
            message: error.message || "Something went wrong",
            messageType: "error",
          });
    }
  };

//  Handle actual password reset
export const getResetPassword = async (req, res) => {
    const { token } = req.params;
  
    try {
      // Find user by reset token and make sure token is not expired
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });
  
      if (!user) {
        // Token invalid or expired
        return res.render("resetpassword", {
          token: null,
          message: "Password reset token is invalid or has expired.",
          messageType: "error"
        });
      }
  
      // Token is valid, render the reset password form with the token
      res.render("resetpassword", { token, message: null 
      });
    } catch (error) {
        logger.error("Error in getResetPassword:", error);
      res.status(500).render("resetpassword", {
        token: null,
        message: "Something went wrong. Please try again later.",
        messageType: "error"
      });
    }
  };
export const postResetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        await resetPassword(token, newPassword);
        return res.status(200).redirect("/"); // Redirect to login page
    } catch (err) {
        logger.error("Reset password error:", err);
        return res.status(400).json({ message: err.message || "Password reset failed." });
    }
};
