const express = require("express");
const router = express.Router();
const { protect: authenticateJWT } = require("../middlewares/authMiddleware");
const courseController = require("../controllers/coursesControllers");

// POST /courses - Create a new course (Instructors only)
router.post("/", authenticateJWT, courseController.createCourse);

// GET /courses - Get all courses
router.get("/", courseController.getCourses);

// PUT /courses/:id - Update course information (Instructors only)
router.put("/:id", authenticateJWT, courseController.updateCourse);

// DELETE /courses/:id - Delete a course (Instructors or Admin only)
router.delete("/:id", authenticateJWT, courseController.deleteCourse);

module.exports = router;
