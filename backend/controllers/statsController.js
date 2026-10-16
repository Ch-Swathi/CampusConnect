const Complaint = require("../models/Complaint");
const LostFound = require("../models/LostFound");
const User = require("../models/User");
const Department = require("../models/Department");

async function getDashboardStats(req, res) {
  try {
    const isStudent = req.user && req.user.role === "student";
    const studentId = req.user?._id;
    const studentName = req.user?.name;

    if (isStudent) {
      const userComplaints = await Complaint.find({
        $or: [{ studentId }, { student: studentName }]
      });

      const userLostFound = await LostFound.find({
        $or: [{ studentId }, { student: studentName }]
      });

      const totalComplaints = userComplaints.length;
      const pending = userComplaints.filter((c) => c.status === "Pending").length;
      const inProgress = userComplaints.filter((c) => c.status === "In Progress").length;
      const resolved = userComplaints.filter((c) => c.status === "Resolved").length;
      const lostFoundCount = userLostFound.length;

      const recentComplaints = userComplaints.slice(0, 5).map((c) => ({
        id: c._id.toString(),
        title: c.title,
        department: c.department,
        location: c.location,
        status: c.status
      }));

      return res.json({
        totalComplaints,
        pending,
        inProgress,
        resolved,
        lostFoundCount,
        recentComplaints
      });
    }

    // Admin Stats
    const allComplaints = await Complaint.find();
    const allLostFound = await LostFound.find();
    const studentCount = await User.countDocuments({ role: "student" });

    const totalComplaints = allComplaints.length;
    const pending = allComplaints.filter((c) => c.status === "Pending").length;
    const inProgress = allComplaints.filter((c) => c.status === "In Progress").length;
    const resolved = allComplaints.filter((c) => c.status === "Resolved").length;
    const lostFoundCount = allLostFound.length;

    return res.json({
      complaints: totalComplaints,
      pending,
      inProgress,
      resolved,
      students: studentCount,
      lostFound: lostFoundCount
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error.message);
    return res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
}

async function getReports(req, res) {
  try {
    const complaints = await Complaint.find();
    const lostFoundItems = await LostFound.find();
    const departments = await Department.find();

    const totalComplaints = complaints.length;
    const pending = complaints.filter((c) => !c.status || c.status === "Pending").length;
    const inProgress = complaints.filter((c) => c.status === "In Progress").length;
    const resolved = complaints.filter((c) => c.status === "Resolved").length;

    const lostItems = lostFoundItems.filter((i) => i.type === "Lost").length;
    const foundItems = lostFoundItems.filter((i) => i.type === "Found").length;
    const activeItems = lostFoundItems.filter((i) => i.status !== "Resolved").length;

    const departmentCounts = departments.map((d) => ({
      id: d._id.toString(),
      name: d.name,
      count: complaints.filter((c) => c.department === d.name).length
    }));

    const categories = [
      "Academic",
      "Infrastructure",
      "Hostel",
      "Library",
      "Transport",
      "Cleanliness",
      "Electrical",
      "WiFi",
      "Food",
      "IT",
      "Other"
    ];

    const categoryCounts = categories.map((cat) => ({
      category: cat,
      count: complaints.filter((c) => (c.category || "").toLowerCase() === cat.toLowerCase()).length
    }));

    return res.json({
      complaints: {
        total: totalComplaints,
        pending,
        inProgress,
        resolved
      },
      lostFound: {
        total: lostFoundItems.length,
        lost: lostItems,
        found: foundItems,
        active: activeItems
      },
      departmentCounts,
      categoryCounts,
      totalDepartments: departments.length
    });
  } catch (error) {
    console.error("Error generating reports:", error.message);
    return res.status(500).json({ message: "Failed to generate reports" });
  }
}

module.exports = {
  getDashboardStats,
  getReports
};
