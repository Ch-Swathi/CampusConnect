const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Get all students
async function getStudents(req, res) {
  try {
    const { search } = req.query;
    let query = { role: "student" };

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [
        { name: regex },
        { rollNumber: regex },
        { studentId: regex },
        { email: regex },
        { department: regex }
      ];
    }

    const students = await User.find(query).sort({ createdAt: -1 });

    const formatted = students.map((s) => ({
      id: s._id.toString(),
      _id: s._id.toString(),
      name: s.name,
      rollNumber: s.rollNumber || s.studentId || "",
      studentId: s.studentId || s.rollNumber || "",
      email: s.email,
      phone: s.phone || "",
      department: s.department || "Computer Science & Engineering",
      year: s.year || "3rd Year",
      section: s.section || "A",
      createdAt: s.createdAt ? new Date(s.createdAt).toLocaleDateString() : new Date().toLocaleDateString()
    }));

    return res.json(formatted);
  } catch (error) {
    console.error("Error fetching students:", error.message);
    return res.status(500).json({ message: "Failed to fetch students" });
  }
}

// Add student
async function createStudent(req, res) {
  try {
    const { name, rollNumber, email, phone, department, year, section, password } = req.body;

    if (!name || !rollNumber || !email) {
      return res.status(400).json({ message: "Name, Roll Number and Email are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: "A student with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password || "student123", 10);

    const student = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      rollNumber: rollNumber.trim(),
      studentId: rollNumber.trim(),
      phone: (phone || "").trim(),
      department: department || "Computer Science & Engineering",
      year: year || "3rd Year",
      section: section || "A",
      role: "student"
    });

    return res.status(201).json({
      message: "Student added successfully",
      student: {
        id: student._id.toString(),
        _id: student._id.toString(),
        name: student.name,
        rollNumber: student.rollNumber,
        email: student.email,
        phone: student.phone,
        department: student.department,
        year: student.year,
        section: student.section,
        createdAt: new Date().toLocaleDateString()
      }
    });
  } catch (error) {
    console.error("Error creating student:", error.message);
    return res.status(500).json({ message: "Failed to add student" });
  }
}

// Update student
async function updateStudent(req, res) {
  try {
    const { id } = req.params;
    const { name, rollNumber, email, phone, department, year, section } = req.body;

    const student = await User.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (name) student.name = name.trim();
    if (rollNumber) {
      student.rollNumber = rollNumber.trim();
      student.studentId = rollNumber.trim();
    }
    if (email) {
      const normalizedEmail = email.trim().toLowerCase();
      if (normalizedEmail !== student.email) {
        const existing = await User.findOne({ email: normalizedEmail, _id: { $ne: id } });
        if (existing) {
          return res.status(409).json({ message: "Email is already taken by another user" });
        }
        student.email = normalizedEmail;
      }
    }
    if (phone !== undefined) student.phone = phone.trim();
    if (department) student.department = department.trim();
    if (year) student.year = year.trim();
    if (section) student.section = section.trim();

    await student.save();

    return res.json({
      message: "Student updated successfully",
      student: {
        id: student._id.toString(),
        _id: student._id.toString(),
        name: student.name,
        rollNumber: student.rollNumber,
        email: student.email,
        phone: student.phone,
        department: student.department,
        year: student.year,
        section: student.section
      }
    });
  } catch (error) {
    console.error("Error updating student:", error.message);
    return res.status(500).json({ message: "Failed to update student" });
  }
}

// Delete student
async function deleteStudent(req, res) {
  try {
    const { id } = req.params;
    const student = await User.findByIdAndDelete(id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.json({ message: "Student deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete student" });
  }
}

module.exports = {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent
};
