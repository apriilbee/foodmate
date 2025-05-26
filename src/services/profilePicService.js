import UserProfile from "../models/UserProfile.js";

export const getProfilePic = async (userId) => {
    const profile = await UserProfile.findOne({userId});
    const profilePic = profile?.profilePic;

    return profilePic
}