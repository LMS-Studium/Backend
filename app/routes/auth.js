const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  resetPassword,
  changePassword,
} = require("../controllers/authControllers");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

// Register a new user
router.post("/register", registerUser);

// User login
router.post("/login", loginUser);

// Logout user
router.post("/logout", protect, logoutUser);

// Reset password
router.post("/reset-password", resetPassword);

// Change password
router.put("/change-password", protect, changePassword);

module.exports = router;
