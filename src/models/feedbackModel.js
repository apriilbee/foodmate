import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  message: { type: String, maxlength: 250 },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Feedback", feedbackSchema);
