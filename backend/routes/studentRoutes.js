const express = require("express");
const router = express.Router();

const {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent
} = require("../controllers/studentController");

const { optionalAuth } = require("../middleware/authMiddleware");

// Routes
router.get("/", optionalAuth, getStudents);
router.post("/", optionalAuth, createStudent);
router.put("/:id", optionalAuth, updateStudent);
router.delete("/:id", optionalAuth, deleteStudent);

module.exports = router;
