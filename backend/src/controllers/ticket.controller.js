import Ticket from "../models/Ticket.js";
import { analyzeImage } from "../services/imageAnalysis.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createTicket = async (req, res) => {
  try {
    const { title, description, office, workstation, priority, location } =
      req.body;

    console.log("📝 Creating ticket:", { title, files: req.files?.length || 0 });

    // Procesar archivos subidos
    const mediaFiles = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const mediaUrl = `/uploads/${file.filename}`;
        
        // Solo analizar imágenes (no videos)
        let aiAnalysis = null;
        if (file.mimetype.startsWith("image/")) {
          console.log("🤖 Analyzing image:", file.filename);
          aiAnalysis = await analyzeImage(file.path);
        }

        mediaFiles.push({
          url: mediaUrl,
          mimeType: file.mimetype,
          aiAnalysis,
        });
      }
    }

    // Parsear location si viene como string
    let parsedLocation = location;
    if (typeof location === "string") {
      try {
        parsedLocation = JSON.parse(location);
      } catch (err) {
        parsedLocation = null;
      }
    }

    const ticket = await Ticket.create({
      title,
      description,
      user: req.user._id,
      office,
      workstation,
      priority,
      location: parsedLocation,
      media: mediaFiles,
    });

    const populatedTicket = await Ticket.findById(ticket._id)
      .populate("user", "name email")
      .populate("office");

    console.log("✅ Ticket created:", ticket._id);

    res.status(201).json(populatedTicket);
  } catch (err) {
    console.error("❌ Error creating ticket:", err);
    res.status(400).json({ error: err.message });
  }
};

export const getTickets = async (req, res) => {
  try {
    let tickets;

    if (req.user.role === "admin" || req.user.role === "servicedesk") {
      tickets = await Ticket.find()
        .populate("user", "name email")
        .populate("assignedTo", "name email")
        .populate("office")
        .sort({ createdAt: -1 });
    } else {
      tickets = await Ticket.find({ user: req.user._id })
        .populate("assignedTo", "name email")
        .populate("office")
        .sort({ createdAt: -1 });
    }

    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("user", "name email")
      .populate("assignedTo", "name email")
      .populate("office");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (
      req.user.role === "standard" &&
      ticket.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTicketStatus = async (req, res) => {
  try {
    const { status, assignedTo } = req.body;

    const updateData = { status };
    if (assignedTo) updateData.assignedTo = assignedTo;
    if (status === "closed") {
      updateData.closedAt = new Date();
      updateData.closedBy = req.user._id;
    }

    const ticket = await Ticket.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    })
      .populate("user", "name email")
      .populate("assignedTo", "name email")
      .populate("office");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json(ticket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const assignTicket = async (req, res) => {
  try {
    const { assignedTo } = req.body;

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      {
        assignedTo,
        status: assignedTo ? "assigned" : "open",
      },
      { new: true }
    )
      .populate("user", "name email")
      .populate("assignedTo", "name email")
      .populate("office");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json(ticket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json({ message: "Ticket deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};