const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getMe,
  updateProfile,
  updateSettings,
  changePassword
} = require("../controllers/authController");

const { authMiddleware } = require("../middleware/authMiddleware");

// Public
router.post("/register", register);
router.post("/login", login);

// Protected
router.get("/me", authMiddleware, getMe);
router.put("/profile", authMiddleware, updateProfile);
router.put("/settings", authMiddleware, updateSettings);
router.put("/change-password", authMiddleware, changePassword);

module.exports = router;