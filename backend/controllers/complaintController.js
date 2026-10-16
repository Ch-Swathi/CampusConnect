const Complaint = require("../models/Complaint");
const Notification = require("../models/Notification");

// Get all complaints with search and filtering
async function getAllComplaints(req, res) {
  try {
    const { search, department, status, category, priority, my } = req.query;
    let query = {};

    if (my === "true" && req.user) {
      query.$or = [{ studentId: req.user._id }, { student: req.user.name }];
    }

    if (department && department !== "All") {
      query.department = department;
    }

    if (status && status !== "All") {
      query.status = status;
    }

    if (category && category !== "All") {
      query.category = category;
    }

    if (priority && priority !== "All") {
      query.priority = priority;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { location: searchRegex },
          { department: searchRegex },
          { student: searchRegex }
        ]
      });
    }

    const complaints = await Complaint.find(query).sort({ createdAt: -1 });

    const formatted = complaints.map((c) => ({
      ...c.toJSON(),
      id: c._id.toString()
    }));

    return res.json(formatted);
  } catch (error) {
    console.error("Error fetching complaints:", error.message);
    return res.status(500).json({ message: "Failed to fetch complaints" });
  }
}

// Get complaints of logged in student
async function getMyComplaints(req, res) {
  try {
    const studentName = req.user?.name;
    const studentId = req.user?._id;

    let query = {};
    if (studentId) {
      query.$or = [{ studentId }, { student: studentName }];
    }

    const complaints = await Complaint.find(query).sort({ createdAt: -1 });

    const formatted = complaints.map((c) => ({
      ...c.toJSON(),
      id: c._id.toString()
    }));

    return res.json(formatted);
  } catch (error) {
    console.error("Error fetching student complaints:", error.message);
    return res.status(500).json({ message: "Failed to fetch student complaints" });
  }
}

// Get single complaint by ID
async function getComplaintById(req, res) {
  try {
    const { id } = req.params;
    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    return res.json({
      ...complaint.toJSON(),
      id: complaint._id.toString()
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to retrieve complaint" });
  }
}

// Create complaint
async function createComplaint(req, res) {
  try {
    const { title, category, department, location, priority, description } = req.body;

    if (!title || !category || !department || !location || !description) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const studentName = req.user?.name || req.body.student || "Student";
    const studentId = req.user?._id || null;

    const newComplaint = await Complaint.create({
      title: title.trim(),
      category: category.trim(),
      department: department.trim(),
      location: location.trim(),
      priority: priority || "Medium",
      description: description.trim(),
      status: "Pending",
      student: studentName,
      studentId,
      date: new Date().toLocaleDateString()
    });

    // Create confirmation notification
    if (studentId) {
      await Notification.create({
        user: studentId,
        title: "Complaint Submitted",
        message: `Your complaint "${newComplaint.title}" has been registered successfully and is pending review.`,
        type: "Complaint",
        date: new Date().toLocaleDateString()
      });
    }

    return res.status(201).json({
      message: "Complaint submitted successfully",
      complaint: {
        ...newComplaint.toJSON(),
        id: newComplaint._id.toString()
      }
    });
  } catch (error) {
    console.error("Error creating complaint:", error.message);
    return res.status(500).json({ message: "Failed to create complaint" });
  }
}

// Update complaint (Admin manage)
async function updateComplaint(req, res) {
  try {
    const { id } = req.params;
    const { status, department, adminRemarks, priority } = req.body;

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    const oldStatus = complaint.status;

    if (status) complaint.status = status;
    if (department !== undefined) complaint.department = department;
    if (adminRemarks !== undefined) complaint.adminRemarks = adminRemarks;
    if (priority) complaint.priority = priority;

    await complaint.save();

    // Notify student if status changed or remarks added
    if (complaint.studentId && (status !== oldStatus || adminRemarks)) {
      await Notification.create({
        user: complaint.studentId,
        title: `Complaint Updated: ${complaint.title}`,
        message: adminRemarks
          ? `Status: ${complaint.status}. Remarks: ${adminRemarks}`
          : `Your complaint status has changed to "${complaint.status}".`,
        type: "Complaint",
        important: status === "Resolved",
        date: new Date().toLocaleDateString()
      });
    }

    return res.json({
      message: "Complaint updated successfully",
      complaint: {
        ...complaint.toJSON(),
        id: complaint._id.toString()
      }
    });
  } catch (error) {
    console.error("Error updating complaint:", error.message);
    return res.status(500).json({ message: "Failed to update complaint" });
  }
}

// Delete complaint
async function deleteComplaint(req, res) {
  try {
    const { id } = req.params;
    const complaint = await Complaint.findByIdAndDelete(id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    return res.json({ message: "Complaint deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete complaint" });
  }
}

module.exports = {
  getAllComplaints,
  getMyComplaints,
  getComplaintById,
  createComplaint,
  updateComplaint,
  deleteComplaint
};
