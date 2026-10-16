const Notification = require("../models/Notification");
const Announcement = require("../models/Announcement");

// Get notifications for student (personal + announcements)
async function getNotifications(req, res) {
  try {
    const userId = req.user?._id;

    let personalQuery = {};
    if (userId) {
      personalQuery = {
        $or: [{ user: userId }, { user: null }]
      };
    }

    const personal = await Notification.find(personalQuery).sort({ createdAt: -1 });
    const announcements = await Announcement.find().sort({ createdAt: -1 });

    const announcementItems = announcements.map((item) => ({
      id: `announcement-${item._id}`,
      _id: `announcement-${item._id}`,
      title: item.important ? `Important: ${item.title}` : item.title,
      message: item.message,
      date: item.date,
      type: "Announcement",
      important: item.important
    }));

    const personalItems = personal.map((item) => ({
      id: item._id.toString(),
      _id: item._id.toString(),
      title: item.title,
      message: item.message,
      date: item.date,
      type: item.type || "System",
      important: item.important || false
    }));

    const combined = [...announcementItems, ...personalItems];

    return res.json(combined);
  } catch (error) {
    console.error("Error fetching notifications:", error.message);
    return res.status(500).json({ message: "Failed to fetch notifications" });
  }
}

// Clear personal notifications
async function clearNotifications(req, res) {
  try {
    const userId = req.user?._id;
    if (userId) {
      await Notification.deleteMany({ user: userId });
    } else {
      await Notification.deleteMany({ type: { $ne: "Announcement" } });
    }

    return res.json({ message: "Notifications cleared successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to clear notifications" });
  }
}

// Create notification
async function createNotification(req, res) {
  try {
    const { title, message, type, important, userId } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: "Title and message are required" });
    }

    const notification = await Notification.create({
      user: userId || req.user?._id || null,
      title: title.trim(),
      message: message.trim(),
      type: type || "System",
      important: Boolean(important),
      date: new Date().toLocaleDateString()
    });

    return res.status(201).json({
      message: "Notification created",
      notification: {
        ...notification.toJSON(),
        id: notification._id.toString()
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create notification" });
  }
}

module.exports = {
  getNotifications,
  clearNotifications,
  createNotification
};
