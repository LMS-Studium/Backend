// controllers/instructorAuthControllers.js
const Instructor = require("../models/InstructorSchema");
const counter = require("../models/IdCounter");
const jwt = require("jsonwebtoken");

// Helper function to generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });

// Register a new instructor
exports.registerInstructor = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const instructorExists = await Instructor.findOne({ email });
    if (instructorExists)
      return res.status(400).json({ message: "Instructor already exists" });

    const instructorId = `INSTRUCTOR-${Date.now()}`; // Generate a unique ID
    const instructor = await Instructor.create({
      name,
      email,
      password,
      instructorId,
    });

    res.status(201).json({
      msg: "Instructor successfully created",
      instructor: {
        name: instructor.name,
        email: instructor.email,
        instructorId: instructor.instructorId,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Instructor login
exports.loginInstructor = async (req, res) => {
  const { email, password } = req.body;

  try {
    const instructor = await Instructor.findOne({ email });
    if (instructor && (await instructor.matchPassword(password))) {
      return res.json({ JWT_TOKEN: generateToken(instructor._id) });
    }
    res.status(400).json({ message: "Invalid credentials" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Logout instructor
exports.logoutInstructor = (req, res) => {
  res.status(200).json({ message: "Instructor logged out" });
};

//Reset password
exports.resetPassword = async (req, res) => {
  const { email } = req.body;
  const instructor = await Instructor.findOne({ email });

  if (instructor)
    return res.status(200).json({ message: "Password reset link sent" });

  res.status(404).json({ message: "User not found" });
};

// Change password
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const instructor = await Instructor.findById(req.instructor.id);

  if (instructor && (await instructor.matchPassword(oldPassword))) {
    instructor.password = newPassword;
    await instructor.save();
    return res.status(200).json({ message: "Password updated" });
  }
  res.status(400).json({ message: "Incorrect old password" });
};
