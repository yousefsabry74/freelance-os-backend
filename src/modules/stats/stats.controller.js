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
  const userId = req.user.id;
  const earning = await Earning.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: { year: { $year: "$paidAt" }, month: { $month: "$paidAt" } },
        total: { $sum: "$amount" },
      },
    },
  ]);
  const expense = await Expense.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: { year: { $year: "$date" }, month: { $month: "$date" } },
        total: { $sum: "$amount" },
      },
    },
  ]);
  const totalEarning = earning.reduce((acc, curr) => {
    const date = String(curr._id.year) + "-" + String(curr._id.month);
    if (!acc[date]) {
      acc[date] = curr.total;
    }
    return acc;
  }, {});
  const totalExpense = expense.reduce((acc, curr) => {
    const date = String(curr._id.year) + "-" + String(curr._id.month);
    if (!acc[date]) {
      acc[date] = curr.total;
    }
    return acc;
  }, {});
  res.status(200).json({
    status: "success",
    data: { totalEarning: totalEarning, totalExpense: totalExpense },
  });
});

const getClientStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const clientId = req.params.id;
  const [client, totalPorjects, totalPorjectsPerStatus, clientProjects] =
    await Promise.all([
      Client.findOne({ userId, _id: clientId }),
      Project.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
            clientId: new mongoose.Types.ObjectId(clientId),
          },
        },
        {
          $group: { _id: null, amount: { $sum: 1 } },
        },
      ]),
      Project.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
            clientId: new mongoose.Types.ObjectId(clientId),
          },
        },
        { $group: { _id: "$status", amount: { $sum: 1 } } },
      ]),
      Project.find({ userId, clientId }, { _id: 1 }),
    ]);

  if (!client) {
    return res.status(404).json({
      status: "error",
      message: "cannot find this client",
    });
  }

  const projectIds = clientProjects.map((p) => p._id);
  const totalEarnings = await Earning.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        projectId: { $in: projectIds },
      },
    },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const totalProjects = totalPorjects[0]?.amount || 0;
  const earnings = totalEarnings[0]?.total || 0;
  res.status(200).json({
    status: "success",
    data: {
      client: client,
      projects: {
        total: totalProjects,
        byStatus: totalPorjectsPerStatus,
      },
      earnings: { total: earnings },
    },
  });
});

module.exports = { getOverview, getMonthly, getClientStats };
