// routes/instructorRoutes.js
const express = require("express");
const {
  registerInstructor,
  loginInstructor,
  logoutInstructor,
  resetPassword,
  changePassword,
} = require("../controllers/instructorControllerAuth");
const { protect } = require("../middlewares/instructorMiddleware"); // Optional: if you want to protect routes

const router = express.Router();

// Register a new instructor
router.post("/register", registerInstructor);

// Instructor login
router.post("/login", loginInstructor);

// Logout instructor
router.post("/logout", protect, logoutInstructor); // Use protect middleware if needed

// Reset password
router.post("/reset-password", resetPassword);

// Change password
router.put("/change-password", protect, changePassword);

module.exports = router;
