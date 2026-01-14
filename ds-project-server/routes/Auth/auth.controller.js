const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Middleware to protect routes
function authMiddleware(req, res, next) {
  try {
    console.log("authMiddleware called");
    const token = req.cookies?.token;
    console.log("Token from cookies:", token);
    if (!token) {
      console.log("No token found in cookies");
      return res.status(401).json({ error: "Not authenticated" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error("Invalid token in authMiddleware:", err);
    return res.status(401).json({ error: "Invalid token" });
  }
}
// --- CREATE ACCOUNT ---
async function createAccount(req, res) {
  try {
    const { email, password } = req.body;
    console.log("/create-account called with:", { email });
    if (!email || !password) {
      console.log("Missing email or password");
      return res.status(400).json({ error: "Email and password required" });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      console.log("Email already in use:", email);
      return res.status(409).json({ error: "Email already in use" });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hash });
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    console.log("Account created for userId:", user._id);
    return res.json({ message: "Account created", userId: user._id });
  } catch (err) {
    console.error("Error in /create-account:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// --- AUTH STATUS ---
async function getMe(req, res) {
  try {
    console.log("/me called for userId:", req.userId);
    const user = await User.findById(req.userId).select("email lastLogin");
    if (!user) {
      console.log("User not found for userId:", req.userId);
      return res.status(404).json({ error: "User not found" });
    }
    console.log("Returning user info:", user?.firstName);
    return res.json({ loggedIn: true, user });
  } catch (err) {
    console.error("Error in /me:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// --- LOGIN ---
async function login(req, res) {
  try {
    const { email, password } = req.body;
    console.log("/login called with:", { email });
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Invalid credentials: user not found for", email);
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      console.log("Invalid credentials: wrong password for", email);
      return res.status(401).json({ error: "Invalid credentials" });
    }
    user.lastLogin = new Date();
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    console.log("User logged in:", user._id);
    return res.json({ message: "Logged in", userId: user._id });
  } catch (err) {
    console.error("Error in /login:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// --- LOGOUT ---
function logout(req, res) {
  try {
    res.clearCookie("token");
    console.log("User logged out");
    return res.json({ message: "Logged out" });
  } catch (err) {
    console.error("Error in /logout:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  authMiddleware,
  createAccount,
  getMe,
  login,
  logout,
};
