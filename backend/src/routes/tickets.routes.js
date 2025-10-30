import express from "express";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import upload from "../config/multer.js";
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicketStatus,
  assignTicket,
  deleteTicket,
  shareTicket,
} from "../controllers/ticket.controller.js";

const router = express.Router();

// Obtener tickets según el rol del usuario
router.get("/", authMiddleware, getTickets);

// Obtener un ticket específico
router.get("/:id", authMiddleware, getTicketById);

// Crear un nuevo ticket con archivos
router.post("/", authMiddleware, upload.array("media", 5), createTicket);

// Compartir ticket por email
router.post("/:id/share", authMiddleware, shareTicket);

// Actualizar estado del ticket (ServiceDesk/Admin)
router.patch(
  "/:id/status",
  authMiddleware,
  requireRole("servicedesk", "admin"),
  updateTicketStatus
);

// Asignar ticket (ServiceDesk/Admin)
router.patch(
  "/:id/assign",
  authMiddleware,
  requireRole("servicedesk", "admin"),
  assignTicket
);

// Eliminar ticket (solo Admin)
router.delete("/:id", authMiddleware, requireRole("admin"), deleteTicket);

export default router;