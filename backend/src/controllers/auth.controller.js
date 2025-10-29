import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    
    console.log("📝 Register attempt:", { email, role: role || "standard" });
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || "standard",
    });

    console.log("✅ User created:", { id: user._id, email: user.email, role: user.role });

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(400).json({ error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log("🔑 Login attempt:", { email });
    
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("👤 User found:", { id: user._id, email: user.email, role: user.role });

    const isValidPassword = await user.comparePassword(password);
    
    console.log("🔐 Password check:", isValidPassword ? "✅ Valid" : "❌ Invalid");

    if (!isValidPassword) {
      console.log("❌ Invalid password for:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isActive) {
      console.log("❌ User inactive:", email);
      return res.status(403).json({ message: "Account is inactive" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("✅ Login successful:", { email, role: user.role });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: err.message });
  }
};