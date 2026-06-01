const asyncHandler = require("express-async-handler");
const Earning = require("./earning.model");
const { createEarningSchema } = require("./earnings.validation");
const mongoose = require("mongoose");

const createEarning = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { error, value } = createEarningSchema.validate(req.body, {
    stripUnknown: true,
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({
      status: "error",
      message: error.details.map((err) => err.message),
    });
  }
  const earning = await Earning.create({
    userId,
    projectId: value.projectId,
    amount: value.amount,
    platform: value.platform,
    note: value.note,
  });
  if (!earning) {
    return res
      .status(400)
      .json({ status: "error", message: "cannot create earning" });
  }
  res.status(201).json({ status: "success", data: earning });
});

const getSummary = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const summary = await Earning.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        total: { $sum: "$amount" },
      },
    },
  ]);
  if (summary.length === 0) {
    return res
      .status(200)
      .json({ status: "success", data: { count: 0, total: 0 } });
  }
  const { _id, ...result } = summary[0];
  res.status(200).json({ status: "success", data: result });
});

const getByPlatform = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const platformEarning = await Earning.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: "$platform",
        total: { $sum: "$amount" },
      },
    },
  ]);
  if (platformEarning.length === 0) {
    return res.status(200).json({ status: "success", data: [] });
  }

  res.status(200).json({ status: "success", data: platformEarning });
});

const getMonthly = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const monthly = await Earning.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: {
          year: { $year: "$paidAt" },
          month: { $month: "$paidAt" },
        },
        count: { $sum: 1 },
        total: { $sum: "$amount" },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
  ]);

  if (monthly.length === 0) {
    return res.status(200).json({ status: "success", data: [] });
  }
  const result = monthly.map((item) => ({
    year: item._id.year,
    month: item._id.month,
    count: item.count,
    total: item.total,
  }));

  res.status(200).json({ status: "success", data: result });
});

module.exports = { createEarning, getSummary, getByPlatform, getMonthly };
