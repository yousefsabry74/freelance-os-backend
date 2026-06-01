const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// تحميل متغيرات البيئة
dotenv.config({ path: path.join(__dirname, "../.env") });

const connectDB = require("./config/db");
const errorHandler = require("./middlewares/error");

// Routes
const authRoutes = require("./modules/auth/auth.routes");
const clientsRoutes = require("./modules/clients/clients.routes");
const projectsRoutes = require("./modules/projects/projects.routes");
const expensesRoutes = require("./modules/expenses/expenses.routes");
const earningsRoutes = require("./modules/earnings/earnings.routes");
const remindersRoutes = require("./modules/reminders/reminders.routes");
const statsRoutes = require("./modules/stats/stats.routes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// توصيل الـ Routes
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientsRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/expenses", expensesRoutes);
app.use("/api/earnings", earningsRoutes);
app.use("/api/reminders", remindersRoutes);
app.use("/api/stats", statsRoutes);

// Route بسيط للتجربة
app.get("/", (req, res) => {
  res.json({ message: "Welcome to FreelanceOS API 🚀" });
});

// Error Handler — لازم يكون آخر middleware
app.use(errorHandler);

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    // تشغيل الـ Cron Jobs
    require("./jobs/dailyReminder.job");
    console.log("⏰ Cron Jobs Started");
  });
});
