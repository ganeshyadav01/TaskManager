const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth"); 

const {getUserProfile, updatePassword, deleteUserProfile} = require("../controllers/userProfileController");

router.get('/profile', authenticate, getUserProfile)
router.put('/profile', authenticate, updatePassword)
router.delete("/profile/:id", authenticate, deleteUserProfile)

module.exports = router;