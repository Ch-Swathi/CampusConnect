const express = require("express");
const router = express.Router();

const {
  getAllLostFound,
  getMyLostFound,
  getLostFoundById,
  createLostFound,
  updateLostFound,
  deleteLostFound
} = require("../controllers/lostFoundController");

const { authMiddleware, optionalAuth } = require("../middleware/authMiddleware");

// Routes
router.get("/", optionalAuth, getAllLostFound);
router.get("/my", authMiddleware, getMyLostFound);
router.get("/:id", getLostFoundById);
router.post("/", optionalAuth, createLostFound);
router.put("/:id", optionalAuth, updateLostFound);
router.patch("/:id/status", optionalAuth, updateLostFound);
router.delete("/:id", optionalAuth, deleteLostFound);

module.exports = router;
