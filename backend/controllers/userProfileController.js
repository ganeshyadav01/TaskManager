const bcrypt = require("bcryptjs");
const User = require("../models/UserAuthModel");

// user profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        console.log("user", user)
        return res.status(200).json(user);
    } catch (e) {
        res.status(500).send({message:`User profile not found: ${e.message}`})
    }
}


// user profile changePassword 
exports.updatePassword = async (req, res) => {
    try {
      const userProfile = await User.findById(req.user.id);
      if (!userProfile) return res.status(404).json({ message: "User not found" });
  
      const { currentPassword, newPassword } = req.body;
  
      // Compare current password
      const matchCurrentPassword = await bcrypt.compare(currentPassword, userProfile.password);
      if (!matchCurrentPassword) {
        return res.status(400).json({ message: "Invalid current password" });
      }
  
      // Hash the new password
      const newHashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update password in MongoDB
      await User.updateOne({ _id: req.user.id }, { $set: { password: newHashedPassword } });
  
      res.json({ message: "New password updated successfully" });
    } catch (error) {
      res.status(500).json({ message: `Error updating password: ${error.message}` });
    }
};

// DELETE user profile
 exports.deleteUserProfile =  async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.user.id);
      console.log("deletedUser", deletedUser)
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: `Error deleting user: ${error.message}` });
    }
  };