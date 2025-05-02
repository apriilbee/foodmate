import mongoose from "mongoose";

const userPreferencesSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  dietary: [String],
  allergies: [String]
});

const UserPreferences = mongoose.model("UserPreferences", userPreferencesSchema);
export default UserPreferences;