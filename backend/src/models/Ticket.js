import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    office: { type: mongoose.Schema.Types.ObjectId, ref: "Office" },
    workstation: String,
    status: {
      type: String,
      enum: ["open", "assigned", "in_progress", "closed"],
      default: "open",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    media: [
      {
        url: String,
        mimeType: String,
        aiAnalysis: {
          labels: [String],
          description: String,
          confidence: Number,
        },
      },
    ],
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] }, // [longitude, latitude]
      address: String,
    },
    sharedWith: [{ type: String }], // emails
    closedAt: Date,
    closedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Índice geoespacial para búsquedas por ubicación
ticketSchema.index({ location: "2dsphere" });

export default mongoose.model("Ticket", ticketSchema);