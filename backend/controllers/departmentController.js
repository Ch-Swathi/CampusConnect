const Department = require("../models/Department");
const Complaint = require("../models/Complaint");

// Get all departments with complaint counts
async function getDepartments(req, res) {
  try {
    const departments = await Department.find().sort({ name: 1 });
    const complaints = await Complaint.find();

    const counts = {};
    complaints.forEach((c) => {
      if (c.department) {
        counts[c.department] = (counts[c.department] || 0) + 1;
      }
    });

    const result = departments.map((d) => ({
      ...d.toJSON(),
      id: d._id.toString(),
      complaintCount: counts[d.name] || 0
    }));

    return res.json(result);
  } catch (error) {
    console.error("Error fetching departments:", error.message);
    return res.status(500).json({ message: "Failed to fetch departments" });
  }
}

// Create new department
async function createDepartment(req, res) {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Department name is required" });
    }

    const trimmedName = name.trim();
    const existing = await Department.findOne({
      name: { $regex: new RegExp(`^${trimmedName}$`, "i") }
    });

    if (existing) {
      return res.status(409).json({ message: "This department already exists" });
    }

    const department = await Department.create({
      name: trimmedName,
      description: (description || "").trim()
    });

    return res.status(201).json({
      message: "Department created successfully",
      department: {
        ...department.toJSON(),
        id: department._id.toString(),
        complaintCount: 0
      }
    });
  } catch (error) {
    console.error("Error creating department:", error.message);
    return res.status(500).json({ message: "Failed to create department" });
  }
}

// Update department
async function updateDepartment(req, res) {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Department name is required" });
    }

    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    const oldName = department.name;
    const newName = name.trim();

    // Check duplicate name on different department
    const existing = await Department.findOne({
      _id: { $ne: id },
      name: { $regex: new RegExp(`^${newName}$`, "i") }
    });
    if (existing) {
      return res.status(409).json({ message: "Another department already has this name" });
    }

    department.name = newName;
    if (description !== undefined) department.description = description.trim();
    await department.save();

    // If department renamed, update complaints with old department name
    if (oldName !== newName) {
      await Complaint.updateMany({ department: oldName }, { department: newName });
    }

    return res.json({
      message: "Department updated successfully",
      department: {
        ...department.toJSON(),
        id: department._id.toString()
      }
    });
  } catch (error) {
    console.error("Error updating department:", error.message);
    return res.status(500).json({ message: "Failed to update department" });
  }
}

// Delete department
async function deleteDepartment(req, res) {
  try {
    const { id } = req.params;
    const department = await Department.findById(id);

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    // Check if any complaints are assigned
    const count = await Complaint.countDocuments({ department: department.name });
    if (count > 0) {
      return res.status(400).json({
        message: `This department has ${count} complaint(s). Reassign the complaints before deleting.`
      });
    }

    await Department.findByIdAndDelete(id);

    return res.json({ message: "Department deleted successfully" });
  } catch (error) {
    console.error("Error deleting department:", error.message);
    return res.status(500).json({ message: "Failed to delete department" });
  }
}

module.exports = {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment
};
