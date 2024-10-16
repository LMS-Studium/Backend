const express = require("express");
const Course = require("../models/CourseSchema");
const { protect: authenticateJWT } = require("../middlewares/authMiddleware"); // Import the JWT middleware
const router = express.Router();

// POST /courses - Create a new course (Instructors only)
// POST /courses - Create a new course (Instructors only)
router.post("/", authenticateJWT, async (req, res) => {
  try {
    const { title, description, category, modules } = req.body;

    // Add the instructor from the authenticated user
    const newCourse = new Course({
      title,
      description,
      category,
      modules,
      instructor: req.user._id, // Add the instructor's ID
    });

    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ message: "Error creating course", error });
  }
});

router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().populate("instructor", "name email"); // Use the Course model to query the database
    res.status(200).json(courses); // Return the found courses
  } catch (error) {
    console.error("Error fetching courses:", error); // Log the error
    res
      .status(500)
      .json({ message: "Error fetching courses", error: error.message });
  }
});

// PUT /courses/:id - Update course information (Instructors only)
router.put("/:id", authenticateJWT, async (req, res) => {
  try {
    const { title, description, modules } = req.body;
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { title, description, modules },
      { new: true, runValidators: true }
    );
    if (!updatedCourse)
      return res.status(404).json({ message: "Course not found" });
    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: "Error updating course", error });
  }
});

// DELETE /courses/:id - Delete a course (Instructors or Admin only)
router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse)
      return res.status(404).json({ message: "Course not found" });
    res.status(200).json({ message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting course", error });
  }
});

module.exports = router;
