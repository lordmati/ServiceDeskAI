import express from "express";
import User from "../models/User.js";
import { authMiddleware, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Obtener todos los usuarios (solo Admin)
router.get("/users", authMiddleware, requireRole("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear usuario con rol específico (solo Admin)
router.post("/users", authMiddleware, requireRole("admin"), async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
    });

    res.status(201).json({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Actualizar usuario (solo Admin)
router.put("/users/:id", authMiddleware, requireRole("admin"), async (req, res) => {
  try {
    const { name, email, role, phone, isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, phone, isActive },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Desactivar usuario (solo Admin)
router.delete("/users/:id", authMiddleware, requireRole("admin"), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deactivated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;