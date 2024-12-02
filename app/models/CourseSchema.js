const mongoose = require("mongoose");

// Define the course module schema
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the Instructor model
    ref: "Instructor",
  },
});

module.exports = mongoose.model("Course", courseSchema);
