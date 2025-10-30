import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.routes.js";
import ticketRoutes from "./routes/tickets.routes.js";
import officeRoutes from "./routes/offices.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { verifyEmailConfig } from "./services/email.service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Servir archivos estáticos (imágenes subidas)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Verificar configuración de email
verifyEmailConfig();

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/offices", officeRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => res.send("ServiceDeskAI API running 🚀"));

app.listen(5000, () => console.log("Backend running on port 5000"));