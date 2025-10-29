import express from "express";
import { loginUser, registerUser } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Obtener perfil del usuario autenticado
router.get("/me", authMiddleware, async (req, res) => {
  res.json({
    id: req.user._id,
    email: req.user.email,
    name: req.user.name,
    role: req.user.role,
    phone: req.user.phone,
    favoriteOffice: req.user.favoriteOffice,
    favoriteWorkstation: req.user.favoriteWorkstation,
  });
});

// Actualizar perfil
router.put("/me", authMiddleware, async (req, res) => {
  try {
    const { name, phone, favoriteOffice, favoriteWorkstation } = req.body;
    
    const user = await req.user.updateOne({
      name,
      phone,
      favoriteOffice,
      favoriteWorkstation,
    });

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;