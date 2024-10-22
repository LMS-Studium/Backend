const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Helper function to generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });

// Register a new user
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });
    res.status(201).json({
      msg: "User successfully created",
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// User login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      return res.json({ JWT_TOKEN: generateToken(user._id) });
    }
    res.status(400).json({ message: "Invalid credentials" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Logout user
exports.logoutUser = (req, res) => {
  res.status(200).json({ message: "User logged out" });
};

// Reset password (send a reset link)
exports.resetPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (user)
    return res.status(200).json({ message: "Password reset link sent" });

  res.status(404).json({ message: "User not found" });
};

// Change password
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);

  if (user && (await user.matchPassword(oldPassword))) {
    user.password = newPassword;
    await user.save();
    return res.status(200).json({ message: "Password updated" });
  }
  res.status(400).json({ message: "Incorrect old password" });
};
