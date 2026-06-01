const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "الاسم مطلوب"],
  },
  email: {
    type: String,
    required: [true, "الإيميل مطلوب"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "الباسوورد مطلوب"],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ["freelancer", "instructor"],
    default: "freelancer",
  },
  specialty: {
    type: String, // programming | design | teaching ...
  },
  platforms: {
    type: [String], // upwork | mostaql | khamsat ...
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
