const express = require("express");
const router = express.Router();
const expensesController = require("./expenses.controller");
const auth = require("../../middlewares/auth");

router.use(auth);

router.post("/", expensesController.createExpense);
router.get("/", expensesController.getAllExpenses);
router.get("/summary", expensesController.getSummary);
router.get("/by-category", expensesController.getByCategory);
router.get("/:id", expensesController.getExpenseById);
router.put("/:id", expensesController.updateExpense);
router.delete("/:id", expensesController.deleteExpense);

module.exports = router;
