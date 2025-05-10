import Feedback from "../models/feedbackModel.js";

// Submit Feedback 
export const submitFeedback = async (req, res) => {
  try {
    const { rating, message } = req.body;
    const userId =  req.user.id;
  
    console.log("Incoming feedback:", { rating, message, userId });
  
    if (!userId) {
      console.log("Unauthorized - No user ID");
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
  
    const feedback = new Feedback({ user: userId, rating, message });
   
    await feedback.save();
   
    console.log("Feedback saved!");
   
    res.status(201).json({ success: true, message: "Feedback submitted!" });
  } catch (err) {
    console.error("Error saving feedback:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
  
};

// Get All Feedback 
export const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate("user", "username");
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

  try {
    const feedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      { rating, message },
      { new: true }
    );
    if (!feedback) {
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }
    res.status(200).json({ success: true, message: "Feedback updated!", data: feedback });
  } catch (err) {
    console.error("Error updating feedback:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete Feedback
export const deleteFeedback = async (req, res) => {
  const feedbackId = req.params.id;

  try {
    const feedback = await Feedback.findByIdAndDelete(feedbackId);
    if (!feedback) {
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }
    res.status(200).json({ success: true, message: "Feedback deleted!" });
  } catch (err) {
    console.error("Error deleting feedback:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
