const LostFound = require("../models/LostFound");
const Notification = require("../models/Notification");

// Get all lost and found items
async function getAllLostFound(req, res) {
  try {
    const { search, type, status, my } = req.query;
    let query = {};

    if (my === "true" && req.user) {
      query.$or = [{ studentId: req.user._id }, { student: req.user.name }];
    }

    if (type && type !== "All") {
      query.type = type;
    }

    if (status && status !== "All") {
      query.status = status;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { itemName: searchRegex },
          { location: searchRegex },
          { description: searchRegex },
          { student: searchRegex },
          { category: searchRegex }
        ]
      });
    }

    const items = await LostFound.find(query).sort({ createdAt: -1 });

    const formatted = items.map((item) => ({
      ...item.toJSON(),
      id: item._id.toString()
    }));

    return res.json(formatted);
  } catch (error) {
    console.error("Error fetching lost/found items:", error.message);
    return res.status(500).json({ message: "Failed to fetch lost and found items" });
  }
}

// Get items posted by logged in student
async function getMyLostFound(req, res) {
  try {
    const studentName = req.user?.name;
    const studentId = req.user?._id;

    let query = {};
    if (studentId) {
      query.$or = [{ studentId }, { student: studentName }];
    }

    const items = await LostFound.find(query).sort({ createdAt: -1 });

    const formatted = items.map((item) => ({
      ...item.toJSON(),
      id: item._id.toString()
    }));

    return res.json(formatted);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch student items" });
  }
}

// Get item by ID
async function getLostFoundById(req, res) {
  try {
    const { id } = req.params;
    const item = await LostFound.findById(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.json({
      ...item.toJSON(),
      id: item._id.toString()
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch item" });
  }
}

// Create lost/found item
async function createLostFound(req, res) {
  try {
    const { itemName, category, type, location, date, contact, description, image } = req.body;

    if (!itemName || !type || !location || !date || !contact || !description) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const studentName = req.user?.name || req.body.student || "Student";
    const studentId = req.user?._id || null;

    const newItem = await LostFound.create({
      itemName: itemName.trim(),
      category: category ? category.trim() : "Other",
      type: type === "Found" ? "Found" : "Lost",
      location: location.trim(),
      date,
      contact: contact.trim(),
      description: description.trim(),
      image: image || "",
      student: studentName,
      studentId,
      status: "Active",
      datePosted: new Date().toLocaleDateString()
    });

    return res.status(201).json({
      message: `${newItem.type} item reported successfully`,
      item: {
        ...newItem.toJSON(),
        id: newItem._id.toString()
      }
    });
  } catch (error) {
    console.error("Error creating lost/found item:", error.message);
    return res.status(500).json({ message: "Failed to report item" });
  }
}

// Update lost/found item or status
async function updateLostFound(req, res) {
  try {
    const { id } = req.params;
    const { status, itemName, location, description, contact, category } = req.body;

    const item = await LostFound.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (status) item.status = status;
    if (itemName) item.itemName = itemName.trim();
    if (location) item.location = location.trim();
    if (description) item.description = description.trim();
    if (contact) item.contact = contact.trim();
    if (category) item.category = category.trim();

    await item.save();

    return res.json({
      message: "Post updated successfully",
      item: {
        ...item.toJSON(),
        id: item._id.toString()
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update item" });
  }
}

// Delete lost/found item
async function deleteLostFound(req, res) {
  try {
    const { id } = req.params;
    const item = await LostFound.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.json({ message: "Item deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete item" });
  }
}

module.exports = {
  getAllLostFound,
  getMyLostFound,
  getLostFoundById,
  createLostFound,
  updateLostFound,
  deleteLostFound
};
