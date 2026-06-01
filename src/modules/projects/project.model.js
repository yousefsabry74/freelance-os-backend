const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  title: {
    type: String,
    required: [true, "اسم المشروع مطلوب"],
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "done", "cancelled"],
    default: "pending",
    required: true,
  },
  budget: {
    type: Number,
  },
  deadline: {
    type: Date,
  },
  platform: {
    type: String, // upwork | direct | mostaql ...
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
projectSchema.index({ userId: 1 });
const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
