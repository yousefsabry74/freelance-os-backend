const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Reminder = require("./reminder.model");
const {
  createReminderSchema,
  updateReminderSchema,
} = require("./reminders.validation");

const createReminder = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { error, value } = createReminderSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (error) {
    return res.status(400).json({
      status: "error",
      message: error.details.map((err) => err.message),
    });
  }
  const reminder = await Reminder.create({ userId, ...value });
  res.status(201).json({ status: "success", data: reminder });
});

const getAllReminders = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const reminders = await Reminder.find({ userId }).select("-__v -userId");
  if (reminders.length === 0) {
    return res
      .status(404)
      .json({ status: "error", message: "cannot find any reminder" });
  }
  res.status(200).json({ status: "success", data: reminders });
});

const getToday = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const reminders = await Reminder.find({
    userId,
    dueDate: { $gte: startOfDay, $lte: endOfDay },
    status: "pending",
  }).select("-__v -userId");

  res.status(200).json({ status: "success", data: reminders });
});

const getReminderById = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const reminderId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(reminderId)) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid ID format" });
  }
  const reminder = await Reminder.findOne({ userId, _id: reminderId });
  if (!reminder) {
    return res
      .status(404)
      .json({ status: "error", message: "cannot find this reminder" });
  }
  res.status(200).json({ status: "success", data: reminder });
});

const updateReminder = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const reminderId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(reminderId)) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid ID format" });
  }

  const { error, value } = updateReminderSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (error) {
    return res.status(400).json({
      status: "error",
      message: error.details.map((err) => err.message),
    });
  }
  if (Object.keys(value).length === 0) {
    return res.status(400).json({
      status: "error",
      message: "No fields provided to update",
    });
  }
  const reminder = await Reminder.findOneAndUpdate(
    { userId, _id: reminderId },
    value,
    { new: true },
  );
  if (!reminder) {
    return res
      .status(404)
      .json({ status: "error", message: "cannot find this reminder" });
  }
  res.status(200).json({ status: "success", data: reminder });
});

const deleteReminder = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const reminderId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(reminderId)) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid ID format" });
  }

  const isDeleted = await Reminder.findOneAndDelete({
    userId,
    _id: reminderId,
  });
  if (!isDeleted) {
    return res
      .status(404)
      .json({ status: "error", message: "invalid reminderId" });
  }
  res
    .status(200)
    .json({ status: "success", message: "reminder have been deleted" });
});

module.exports = {
  createReminder,
  getAllReminders,
  getToday,
  getReminderById,
  updateReminder,
  deleteReminder,
};
