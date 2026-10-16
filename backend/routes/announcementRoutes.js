const express = require("express");
const router = express.Router();

const {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  deleteAllAnnouncements
} = require("../controllers/announcementController");

const { optionalAuth } = require("../middleware/authMiddleware");

// Routes
router.get("/", getAnnouncements);
router.post("/", optionalAuth, createAnnouncement);
router.put("/:id", optionalAuth, updateAnnouncement);
router.delete("/all", optionalAuth, deleteAllAnnouncements);
router.delete("/:id", optionalAuth, deleteAnnouncement);
router.delete("/", optionalAuth, deleteAllAnnouncements);

module.exports = router;
