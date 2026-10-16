const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

router.get("/", (req, res) => {
  const dbStates = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
  };

  const status = mongoose.connection.readyState === 1 ? "ok" : "degraded";

  return res.json({
    status,
    message: "CampusConnect Backend API is healthy",
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    database: {
      status: dbStates[mongoose.connection.readyState] || "unknown",
      readyState: mongoose.connection.readyState
    },
    version: "1.0.0"
  });
});

module.exports = router;
