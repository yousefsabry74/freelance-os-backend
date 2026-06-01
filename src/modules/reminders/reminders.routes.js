const express = require("express");
const router = express.Router();
const remindersController = require("./reminders.controller");
const auth = require("../../middlewares/auth");

router.use(auth);

router.post("/", remindersController.createReminder);
router.get("/", remindersController.getAllReminders);
router.get("/today", remindersController.getToday);
router.get("/:id", remindersController.getReminderById);
router.put("/:id", remindersController.updateReminder);
router.delete("/:id", remindersController.deleteReminder);

module.exports = router;
