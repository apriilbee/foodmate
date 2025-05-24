import Feedback from "../models/feedbackModel.js";
import { logger } from "../utils/logger.js";
export const submitFeedback = async (req, res) => {
    try {
        const { rating, message } = req.body;
        const userId = req.user.id;

        logger.info("Incoming feedback:", { rating, message, userId });

        if (!userId) {
            logger.info("Unauthorized - No user ID");
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const feedback = new Feedback({ user: userId, rating, message });

        await feedback.save();

        logger.info("Feedback saved!");

        res.status(201).json({ success: true, message: "Feedback submitted!" });
    } catch (err) {
        console.error("Error saving feedback:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get All Feedback
export const getAllFeedback = async (req, res) => {
    try {
        const userId = req.user.id;
        const showAll = req.query.all === "true";

        const query = showAll
            ? { user: userId } // Include soft-deleted if all=true
            : { user: userId, isDeleted: false }; // Default: show only active feedback

        const feedbacks = await Feedback.find(query).populate("user", "username");
        res.status(200).json({ success: true, data: feedbacks });
    } catch (err) {
        console.error("Error fetching feedback:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Update Feedback
export const updateFeedback = async (req, res) => {
    const { rating, message } = req.body;
    const feedbackId = req.params.id;
    const userId = req.user.id;

    try {
        const feedback = await Feedback.findById(feedbackId);

        if (!feedback) {
            return res.status(404).json({ success: false, message: "Feedback not found" });
        }

        if (feedback.user.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        feedback.rating = rating;
        feedback.message = message;
        await feedback.save();

        res.status(200).json({ success: true, message: "Feedback updated!", data: feedback });
    } catch (err) {
        console.error("Error updating feedback:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Soft Delete Feedback
export const deleteFeedback = async (req, res) => {
    const feedbackId = req.params.id;
    const userId = req.user.id;

    try {
        const feedback = await Feedback.findById(feedbackId);

        if (!feedback) {
            return res.status(404).json({ success: false, message: "Feedback not found" });
        }

        if (feedback.user.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        feedback.isDeleted = true;
        await feedback.save();

        res.status(200).json({ success: true, message: "Feedback deleted (soft delete)!" });
    } catch (err) {
        console.error("Error soft deleting feedback:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Restore Feedback
export const restoreFeedback = async (req, res) => {
    const feedbackId = req.params.id;
    const userId = req.user.id;

    try {
        const feedback = await Feedback.findById(feedbackId);

        if (!feedback) {
            return res.status(404).json({ success: false, message: "Feedback not found" });
        }

        if (feedback.user.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        feedback.isDeleted = false;
        await feedback.save();

        res.status(200).json({ success: true, message: "Feedback restored!" });
    } catch (err) {
        console.error("Error restoring feedback:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
