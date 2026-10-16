const express = require("express");
const router = express.Router();

const {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment
} = require("../controllers/departmentController");

const { optionalAuth } = require("../middleware/authMiddleware");

// Routes
router.get("/", getDepartments);
router.post("/", optionalAuth, createDepartment);
router.put("/:id", optionalAuth, updateDepartment);
router.delete("/:id", optionalAuth, deleteDepartment);

module.exports = router;
