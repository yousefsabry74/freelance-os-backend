const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  title: {
    type: String,
    required: [true, "عنوان التذكير مطلوب"],
  },
  description: {
    type: String,
  },
  dueDate: {
    type: Date,
    required: [true, "تاريخ التذكير مطلوب"],
  },
  status: {
    type: String,
    enum: ["pending", "done"],
    default: "pending",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

reminderSchema.index({ userId: 1 });
reminderSchema.index({ userId: 1, status: 1, dueDate: 1 }); // التذكيرات الـ pending اللي تاريخها قريب

const Reminder = mongoose.model("Reminder", reminderSchema);

module.exports = Reminder;
