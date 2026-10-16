const express = require("express");
const router = express.Router();

const {
  getAllComplaints,
  getMyComplaints,
  getComplaintById,
  createComplaint,
  updateComplaint,
  deleteComplaint
} = require("../controllers/complaintController");

const { authMiddleware, optionalAuth } = require("../middleware/authMiddleware");

// Routes
router.get("/", optionalAuth, getAllComplaints);
router.get("/my", authMiddleware, getMyComplaints);
router.get("/:id", getComplaintById);
router.post("/", optionalAuth, createComplaint);
router.put("/:id", optionalAuth, updateComplaint);
router.delete("/:id", authMiddleware, deleteComplaint);

module.exports = router;
