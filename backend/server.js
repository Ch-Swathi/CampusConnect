const dns = require("dns");
dns.setServers(["8.8.8.8"]);

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const seedData = require("./config/seed");

dotenv.config();

const app = express();

// Configure CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CLIENT_URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || origin.startsWith("http://localhost:")) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive for local development
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());

// API Routes
app.use("/api/health", require("./routes/healthRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/complaints", require("./routes/complaintRoutes"));
app.use("/api/lost-found", require("./routes/lostFoundRoutes"));
app.use("/api/departments", require("./routes/departmentRoutes"));
app.use("/api/announcements", require("./routes/announcementRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/students", require("./routes/studentRoutes"));
app.use("/api/stats", require("./routes/statsRoutes"));

// Root route
app.get("/", (req, res) => {
  res.json({
    name: "CampusConnect API",
    status: "online",
    healthCheck: "/api/health"
  });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error"
  });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();
  await seedData();

  app.listen(PORT, () => {
    console.log(`CampusConnect backend running on http://localhost:${PORT}`);
  });
}

startServer();