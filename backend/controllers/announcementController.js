const Announcement = require("../models/Announcement");

// Get all announcements
async function getAnnouncements(req, res) {
  try {
    const { search } = req.query;
    let query = {};

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [{ title: searchRegex }, { message: searchRegex }];
    }

    const announcements = await Announcement.find(query).sort({ createdAt: -1 });

    const formatted = announcements.map((a) => ({
      ...a.toJSON(),
      id: a._id.toString()
    }));

    return res.json(formatted);
  } catch (error) {
    console.error("Error fetching announcements:", error.message);
    return res.status(500).json({ message: "Failed to fetch announcements" });
  }
}

// Create announcement
async function createAnnouncement(req, res) {
  try {
    const { title, message, important } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: "Title and message are required" });
    }

    const author = req.user?.name || "Campus Admin";

    const announcement = await Announcement.create({
      title: title.trim(),
      message: message.trim(),
      important: Boolean(important),
      author,
      date: new Date().toLocaleDateString()
    });

    return res.status(201).json({
      message: "Announcement created successfully",
      announcement: {
        ...announcement.toJSON(),
        id: announcement._id.toString()
      }
    });
  } catch (error) {
    console.error("Error creating announcement:", error.message);
    return res.status(500).json({ message: "Failed to create announcement" });
  }
}

// Update announcement
async function updateAnnouncement(req, res) {
  try {
    const { id } = req.params;
    const { title, message, important } = req.body;

    const announcement = await Announcement.findById(id);
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    if (title) announcement.title = title.trim();
    if (message) announcement.message = message.trim();
    if (important !== undefined) announcement.important = Boolean(important);

    await announcement.save();

    return res.json({
      message: "Announcement updated successfully",
      announcement: {
        ...announcement.toJSON(),
        id: announcement._id.toString()
      }
    });
  } catch (error) {
    console.error("Error updating announcement:", error.message);
    return res.status(500).json({ message: "Failed to update announcement" });
  }
}

// Delete announcement
async function deleteAnnouncement(req, res) {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findByIdAndDelete(id);

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    return res.json({ message: "Announcement deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete announcement" });
  }
}

// Delete all announcements
async function deleteAllAnnouncements(req, res) {
  try {
    await Announcement.deleteMany({});
    return res.json({ message: "All announcements deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete announcements" });
  }
}

module.exports = {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  deleteAllAnnouncements
};
