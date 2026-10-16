const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Department = require("../models/Department");
const Complaint = require("../models/Complaint");
const LostFound = require("../models/LostFound");
const Announcement = require("../models/Announcement");
const Notification = require("../models/Notification");

async function seedData() {
  try {
    // 1. Seed Demo Admin
    let admin = await User.findOne({ email: "admin@campus.com" });
    if (!admin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      admin = await User.create({
        name: "Campus Admin",
        email: "admin@campus.com",
        password: hashedPassword,
        department: "Administration",
        role: "admin",
        phone: "9876543200"
      });
      console.log("Seeded demo admin account: admin@campus.com");
    }

    // 2. Seed Demo Student
    let student = await User.findOne({ email: "student@campus.com" });
    if (!student) {
      const hashedPassword = await bcrypt.hash("student123", 10);
      student = await User.create({
        name: "Swathi Dhanalakshmi",
        email: "student@campus.com",
        password: hashedPassword,
        studentId: "23CSE001",
        rollNumber: "23CSE001",
        department: "Computer Science & Engineering",
        year: "3rd Year",
        section: "A",
        phone: "9876543210",
        role: "student"
      });
      console.log("Seeded demo student account: student@campus.com");
    }

    // 3. Seed Default Departments
    const defaultDepartments = [
      { name: "Computer Science & Engineering", description: "Computer Science and software related complaints" },
      { name: "Electronics & Communication", description: "Electronics and communication related complaints" },
      { name: "Electrical & Electronics", description: "Electrical and power related complaints" },
      { name: "Mechanical Engineering", description: "Mechanical and laboratory related complaints" },
      { name: "Civil Engineering", description: "Civil infrastructure and building related complaints" },
      { name: "Information Technology", description: "IT infrastructure and computer related complaints" },
      { name: "Hostel", description: "Hostel and accommodation related complaints" },
      { name: "Library", description: "Library related complaints" },
      { name: "Transport", description: "College transport related complaints" },
      { name: "Administration", description: "General administration related complaints" },
      { name: "Maintenance", description: "Facility maintenance and repairs" }
    ];

    for (const dept of defaultDepartments) {
      const exists = await Department.findOne({ name: dept.name });
      if (!exists) {
        await Department.create(dept);
      }
    }

    // 4. Seed Initial Complaints if none exist
    const complaintCount = await Complaint.countDocuments();
    if (complaintCount === 0) {
      await Complaint.create([
        {
          title: "Broken Classroom Fan",
          category: "Infrastructure",
          department: "Maintenance",
          location: "Block A - Room 204",
          priority: "Medium",
          description: "The ceiling fan in Room 204 is vibrating heavily and making a loud rattling sound.",
          status: "Pending",
          student: student.name,
          studentId: student._id,
          date: new Date().toLocaleDateString()
        },
        {
          title: "WiFi Connection Issue",
          category: "WiFi",
          department: "Information Technology",
          location: "Block B - Lab 3",
          priority: "High",
          description: "High packet drop and intermittent disconnection during lab practice sessions.",
          status: "In Progress",
          student: student.name,
          studentId: student._id,
          adminRemarks: "IT team dispatched network technician to check router switch.",
          date: new Date().toLocaleDateString()
        },
        {
          title: "Water Problem",
          category: "Cleanliness",
          department: "Hostel",
          location: "Girls Hostel Block 2",
          priority: "Medium",
          description: "Low water pressure on the second floor during morning hours.",
          status: "Resolved",
          student: student.name,
          studentId: student._id,
          adminRemarks: "Water pump serviced and pressure restored.",
          date: new Date().toLocaleDateString()
        }
      ]);
      console.log("Seeded initial complaints");
    }

    // 5. Seed Initial Lost & Found if none exist
    const lostFoundCount = await LostFound.countDocuments();
    if (lostFoundCount === 0) {
      await LostFound.create([
        {
          itemName: "Blue Water Bottle",
          category: "Other",
          type: "Found",
          location: "Canteen",
          date: new Date().toISOString().split("T")[0],
          contact: "student@campus.com",
          description: "Milton steel water bottle left at table 4 after lunch.",
          student: student.name,
          studentId: student._id,
          status: "Active",
          datePosted: new Date().toLocaleDateString()
        },
        {
          itemName: "Black Leather Wallet",
          category: "Wallet",
          type: "Lost",
          location: "Library Reading Room",
          date: new Date().toISOString().split("T")[0],
          contact: "9876543210",
          description: "Black wallet containing college ID card and library card.",
          student: student.name,
          studentId: student._id,
          status: "Active",
          datePosted: new Date().toLocaleDateString()
        }
      ]);
      console.log("Seeded initial lost & found items");
    }

    // 6. Seed Initial Announcements if none exist
    const announcementCount = await Announcement.countDocuments();
    if (announcementCount === 0) {
      await Announcement.create([
        {
          title: "Campus Maintenance Notice",
          message: "Campus power and network maintenance will take place on Saturday between 6:00 PM and 9:00 PM.",
          important: true,
          date: new Date().toLocaleDateString(),
          author: "Campus Admin"
        },
        {
          title: "Annual Sports Meet 2026",
          message: "Registration for track and field events is now open in the Sports Office.",
          important: false,
          date: new Date().toLocaleDateString(),
          author: "Sports Department"
        }
      ]);
      console.log("Seeded initial announcements");
    }

    // 7. Seed Initial Notifications for Student if none exist
    const notifCount = await Notification.countDocuments();
    if (notifCount === 0) {
      await Notification.create([
        {
          user: student._id,
          title: "Complaint Updated",
          message: "Your WiFi complaint is in progress with the IT Department.",
          type: "Complaint",
          important: false,
          date: new Date().toLocaleDateString()
        },
        {
          user: student._id,
          title: "Possible Lost Item Match",
          message: "Someone reported finding a Blue Water Bottle in the Canteen.",
          type: "LostFound",
          important: false,
          date: new Date().toLocaleDateString()
        }
      ]);
      console.log("Seeded initial notifications");
    }
  } catch (error) {
    console.error("Error seeding data:", error.message);
  }
}

module.exports = seedData;
