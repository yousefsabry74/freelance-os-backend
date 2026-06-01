const mongoose = require("mongoose");

const earningSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  amount: {
    type: Number,
    required: [true, "المبلغ مطلوب"],
  },
  platform: {
    type: String, // upwork | direct | mostaql ...
  },
  paidAt: {
    type: Date,
    default: Date.now,
  },
  note: {
    type: String,
  },
});
earningSchema.index({ userId: 1 });
earningSchema.index({ userId: 1, platform: 1 });
earningSchema.index({ userId: 1, paidAt: -1 });
const Earning = mongoose.model("Earning", earningSchema);

module.exports = Earning;
