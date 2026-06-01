const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: [true, "اسم المصروف مطلوب"],
  },
  amount: {
    type: Number,
    required: [true, "المبلغ مطلوب"],
  },
  category: {
    type: String,
    enum: [
      "subscription",
      "tools",
      "internet",
      "hosting",
      "marketing",
      "other",
    ],
    default: "other",
  },
  recurring: {
    type: Boolean, // اشتراك شهري ولا مرة واحدة
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  note: {
    type: String,
  },
});
expenseSchema.index({ userId: 1 });
expenseSchema.index({ userId: 1, category: 1 });

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
