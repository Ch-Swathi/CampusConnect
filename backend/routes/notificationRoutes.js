const express = require("express");
const router = express.Router();

const {
  getNotifications,
  clearNotifications,
  createNotification
} = require("../controllers/notificationController");

const { optionalAuth } = require("../middleware/authMiddleware");

// Routes
router.get("/", optionalAuth, getNotifications);
router.delete("/", optionalAuth, clearNotifications);
router.post("/", optionalAuth, createNotification);

module.exports = router;
