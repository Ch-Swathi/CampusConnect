const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function createToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET || "campusconnect_secret_key_2026",
    { expiresIn: "7d" }
  );
}

function sanitizeUser(user) {
  return {
    id: user._id.toString(),
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    studentId: user.studentId || user.rollNumber || "",
    rollNumber: user.rollNumber || user.studentId || "",
    department: user.department || "",
    year: user.year || "3rd Year",
    section: user.section || "A",
    phone: user.phone || "",
    role: user.role,
    settings: user.settings || {
      notifications: true,
      emailUpdates: true,
      darkMode: false
    }
  };
}

// Register a new student
async function register(req, res) {
  try {
    const { name, email, password, studentId, rollNumber, department, year, section, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    if (typeof password !== "string" || password.length < 6) {
      return res.status(400).json({
        message: "Password must contain at least 6 characters"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      studentId: studentId || rollNumber || "",
      rollNumber: rollNumber || studentId || "",
      department: department || "Computer Science & Engineering",
      year: year || "3rd Year",
      section: section || "A",
      phone: phone || "",
      role: "student"
    });

    const token = createToken(user);

    return res.status(201).json({
      message: "Student registered successfully",
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    return res.status(500).json({
      message: "Unable to register student"
    });
  }
}

// Log in an existing user
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase()
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = createToken(user);

    return res.json({
      message: "Login successful",
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({
      message: "Unable to log in"
    });
  }
}

// Get current logged-in user profile
async function getMe(req, res) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({
      user: sanitizeUser(user)
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching user profile" });
  }
}

// Update profile
async function updateProfile(req, res) {
  try {
    const { name, rollNumber, phone, department, year, section } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name.trim();
    if (rollNumber !== undefined) {
      user.rollNumber = rollNumber.trim();
      user.studentId = rollNumber.trim();
    }
    if (phone !== undefined) user.phone = phone.trim();
    if (department !== undefined) user.department = department.trim();
    if (year !== undefined) user.year = year.trim();
    if (section !== undefined) user.section = section.trim();

    await user.save();

    return res.json({
      message: "Profile updated successfully",
      user: sanitizeUser(user)
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update profile" });
  }
}

// Update settings (notifications, emailUpdates, darkMode)
async function updateSettings(req, res) {
  try {
    const { notifications, emailUpdates, darkMode } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.settings) {
      user.settings = {};
    }

    if (notifications !== undefined) user.settings.notifications = Boolean(notifications);
    if (emailUpdates !== undefined) user.settings.emailUpdates = Boolean(emailUpdates);
    if (darkMode !== undefined) user.settings.darkMode = Boolean(darkMode);

    await user.save();

    return res.json({
      message: "Settings updated successfully",
      settings: user.settings
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update settings" });
  }
}

// Change password
async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password does not match" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to change password" });
  }
}

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  updateSettings,
  changePassword,
  sanitizeUser
};