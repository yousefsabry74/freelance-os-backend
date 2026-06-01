const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: [true, "اسم العميل مطلوب"],
  },
  email: {
    type: String,
    lowercase: true,
  },
  phone: {
    type: String,
  },
  company: {
    type: String,
  },
  notes: {
    type: String,
  },
  platform: {
    type: String, // direct | upwork | mostaql ...
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
clientSchema.index({ userId: 1 });
const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
