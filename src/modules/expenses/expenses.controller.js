const asyncHandler = require("express-async-handler");
const Expense = require("./expense.model");
const {
  createExpenseSchema,
  updateExpenseSchema,
} = require("./expenses.validation");
const mongoose = require("mongoose");

const createExpense = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { error, value } = createExpenseSchema.validate(req.body, {
    stripUnknown: true,
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({
      status: "error",
      message: error.details.map((err) => err.message),
    });
  }

  const expense = await Expense.create({
    userId: userId,
    ...value,
  });
  if (!expense) {
    return res
      .status(400)
      .json({ status: "error", message: "there is an error" });
  }
  res.status(201).json({ status: "success", data: expense });
});

const getAllExpenses = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 5, 50);
  const skip = (page - 1) * limit;
  const expenses = await Expense.find({ userId }).skip(skip).limit(limit);

  res.status(200).json({ status: "success", data: expenses });
});

const getExpenseById = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const expenseId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(expenseId)) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid expense ID" });
  }
  const expense = await Expense.findOne({ userId, _id: expenseId });
  if (!expense) {
    return res
      .status(404)
      .json({ status: "error", message: "cannot find this expense" });
  }
  res.status(200).json({ status: "success", data: expense });
});

const updateExpense = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const expenseId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(expenseId)) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid expense ID" });
  }

  const { error, value } = updateExpenseSchema.validate(req.body, {
    stripUnknown: true,
    abortEarly: false,
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
  const expense = await Expense.findOneAndUpdate(
    { userId, _id: expenseId },
    value,
    { new: true },
  );
  if (!expense) {
    return res
      .status(404)
      .json({ status: "error", message: "cannot find this expense" });
  }
  res.status(200).json({ status: "success", data: expense });
});

const deleteExpense = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const expenseId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(expenseId)) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid expense ID" });
  }
  const deletedExpense = await Expense.findOneAndDelete({
    userId,
    _id: expenseId,
  });
  if (!deletedExpense) {
    return res
      .status(404)
      .json({ status: "error", message: "cannot find this expense" });
  }
  res.status(200).json({ status: "success", data: "expense has been deleted" });
});

const getSummary = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const expenses = await Expense.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalExpense: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);
  if (expenses.length === 0) {
    return res
      .status(200)
      .json({ status: "success", data: { count: 0, total: 0 } });
  }

  const { _id, ...summary } = expenses[0];
  res.status(200).json({ status: "success", data: summary });
});

const getByCategory = asyncHandler(async (req, res) => {
  // TODO: جيب المصاريف مجمعة حسب الـ category
  const userId = req.user.id;
  const expenses = await Expense.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: "$category", totalExpense: { $sum: "$amount" } } },
  ]);
  if (expenses.length === 0) {
    return res
      .status(200)
      .json({ status: "success", data: { count: 0, total: 0 } });
  }
  res.status(200).json({ status: "success", data: expenses });
});

module.exports = {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getSummary,
  getByCategory,
};
