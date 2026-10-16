const express = require("express");
const router = express.Router();

const { getDashboardStats, getReports } = require("../controllers/statsController");
const { optionalAuth } = require("../middleware/authMiddleware");

router.get("/dashboard", optionalAuth, getDashboardStats);
router.get("/reports", optionalAuth, getReports);

module.exports = router;
