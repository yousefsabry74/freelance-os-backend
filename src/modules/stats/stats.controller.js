const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Project = require("../projects/project.model");
const Earning = require("../earnings/earning.model");
const Expense = require("../expenses/expense.model");
const Client = require("../clients/client.model");

const getOverview = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const [projectsStatus, earnings, expense, clientsCount] = await Promise.all([
    Project.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),

    Earning.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, earnings: { $sum: "$amount" } } },
    ]),

    Expense.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, expenses: { $sum: "$amount" } } },
    ]),

    Client.countDocuments({ userId }),
  ]);

  const totalEarning = earnings[0]?.earnings || 0;

  const totalExpense = expense[0]?.expenses || 0;
  const status = projectsStatus.reduce(
    (acc, curr) => {
      acc[curr._id] = curr.count;
      acc["total"] += curr.count;
      return acc;
    },
    {
      total: 0,
      pending: 0,
      "in-progress": 0,
      done: 0,
      cancelled: 0,
    },
  );
  const netProfit = totalEarning - totalExpense;
  const response = {
    projects: status,
    earnings: totalEarning,
    expenses: totalExpense,
    clients: clientsCount,
    netProfit: netProfit,
  };
  res.status(200).json({ status: "success", data: response });
});

const getMonthly = asyncHandler(async (req, res) => {
  // TODO: تقرير شهري كامل
  // Hint: استخدم aggregate مع $group حسب الشهر والسنة
  // اجمع الأرباح والمصاريف لكل شهر
});

const getClientStats = asyncHandler(async (req, res) => {
  // TODO: إحصائيات عميل معين
  // 1. بيانات العميل: Client.findOne({ _id: req.params.id, userId })
  // 2. عدد المشاريع: Project.countDocuments({ clientId, userId })
  // 3. المشاريع حسب الـ status: Project.aggregate(...)
  // 4. إجمالي الأرباح من المشاريع بتاعته: Earning.aggregate(...)
});

module.exports = { getOverview, getMonthly, getClientStats };
