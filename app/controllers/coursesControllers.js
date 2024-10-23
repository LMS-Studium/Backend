const Course = require("../models/CourseSchema");

// Create a new course (Instructors only)
exports.createCourse = async (req, res) => {
  try {
    const { title, price, category } = req.body;

    const newCourse = new Course({
      title,
      category,
      price,
      instructor: req.user._id, // Add the instructor's ID from JWT
    });

    console.log(title, category, price);

    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ message: "Error creating course", error });
  }
};

// Get all courses
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("instructor", "name email");
    res.status(200).json(courses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching courses", error: error.message });
  }
};

// Update course information (Instructors only)
exports.updateCourse = async (req, res) => {
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
};

// Delete a course (Instructors or Admin only)
exports.deleteCourse = async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse)
      return res.status(404).json({ message: "Course not found" });
    res.status(200).json({ message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting course", error });
  }
};
