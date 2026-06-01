const cron = require("node-cron");
const Reminder = require("../modules/reminders/reminder.model");
const Project = require("../modules/projects/project.model");

// كل يوم الصبح الساعة 8
cron.schedule("0 8 * * *", async () => {
  try {
    console.log("⏰ Daily Reminder Job Running...");

    // TODO: 1. جيب كل المشاريع اللي deadline بكرة أو النهارده
    // const tomorrow = new Date();
    // tomorrow.setDate(tomorrow.getDate() + 1);
    // const urgentProjects = await Project.find({
    //   status: { $in: ["pending", "in-progress"] },
    //   deadline: { $lte: tomorrow }
    // }).populate("userId");

    // TODO: 2. جيب كل التذكيرات اللي dueDate النهارده وstatus: pending
    // const today = new Date();
    // today.setHours(0, 0, 0, 0);
    // const endOfDay = new Date();
    // endOfDay.setHours(23, 59, 59, 999);
    // const todayReminders = await Reminder.find({
    //   dueDate: { $gte: today, $lte: endOfDay },
    //   status: "pending"
    // });

    // TODO: 3. اطبعهم في الـ console (أو ابعت notification لما تضيف notification system)
    // console.log(`📋 Urgent Projects: ${urgentProjects.length}`);
    // console.log(`🔔 Today Reminders: ${todayReminders.length}`);

    console.log("✅ Daily Reminder Job Completed");
  } catch (error) {
    console.error("❌ Daily Reminder Job Failed:", error.message);
  }
});

module.exports = cron;
