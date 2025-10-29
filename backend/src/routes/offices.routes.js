import express from "express";
import Office from "../models/Office.js";
import { authMiddleware, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Obtener todas las oficinas
router.get("/", authMiddleware, async (req, res) => {
  try {
    const offices = await Office.find({ isActive: true });
    res.json(offices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener una oficina específica
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const office = await Office.findById(req.params.id);
    if (!office) {
      return res.status(404).json({ message: "Office not found" });
    }
    res.json(office);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear oficina (solo Admin)
router.post("/", authMiddleware, requireRole("admin"), async (req, res) => {
  try {
    const { name, address, city, country, workstations } = req.body;
    
    const office = await Office.create({
      name,
      address,
      city,
      country,
      workstations,
    });

    res.status(201).json(office);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Actualizar oficina (solo Admin)
router.put("/:id", authMiddleware, requireRole("admin"), async (req, res) => {
  try {
    const { name, address, city, country, workstations, isActive } = req.body;
    
    const office = await Office.findByIdAndUpdate(
      req.params.id,
      { name, address, city, country, workstations, isActive },
      { new: true }
    );

    if (!office) {
      return res.status(404).json({ message: "Office not found" });
    }

    res.json(office);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar oficina (solo Admin)
router.delete("/:id", authMiddleware, requireRole("admin"), async (req, res) => {
  try {
    const office = await Office.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!office) {
      return res.status(404).json({ message: "Office not found" });
    }

    res.json({ message: "Office deactivated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;