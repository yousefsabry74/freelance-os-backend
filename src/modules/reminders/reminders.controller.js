const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Reminder = require("./reminder.model");
const { createReminderSchema, updateReminderSchema } = require("./reminders.validation");

const createReminder = asyncHandler(async (req, res) => {
  // TODO: validation بـ createReminderSchema
  // TODO: اعمل Reminder.create() بـ userId + value
});

const getAllReminders = asyncHandler(async (req, res) => {
  // TODO: جيب كل الـ reminders بتاعة الـ user
});

const getToday = asyncHandler(async (req, res) => {
  // TODO: جيب التذكيرات بتاعة النهارده بس
  // Hint: 
  // const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
  // const endOfDay = new Date(); endOfDay.setHours(23, 59, 59, 999);
  // Reminder.find({ userId, dueDate: { $gte: startOfDay, $lte: endOfDay }, status: "pending" })
});

const getReminderById = asyncHandler(async (req, res) => {
  // TODO: جيب reminder بالـ id
});

const updateReminder = asyncHandler(async (req, res) => {
  // TODO: validation بـ updateReminderSchema
  // TODO: حدث الـ reminder
});

const deleteReminder = asyncHandler(async (req, res) => {
  // TODO: امسح الـ reminder
});

module.exports = { createReminder, getAllReminders, getToday, getReminderById, updateReminder, deleteReminder };
