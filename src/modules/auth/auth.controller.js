const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("./user.model");
const bcrypt = require("bcryptjs");
const { registerSchema, loginSchema } = require("./auth.validation");

const register = asyncHandler(async (req, res) => {
  const { error, value } = registerSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({
      status: "error",
      message: error.details.map((err) => err.message),
    });
  }
  const hashedPassword = await bcrypt.hash(value.password, 10);

  const user = await User.create({
    name: value.name,
    email: value.email,
    password: hashedPassword,
    role: value.role,
    specialty: value.specialty,
    platforms: value.platforms,
  });
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );
  res.status(201).json({
    status: "success",
    data: token,
  });
});

const login = asyncHandler(async (req, res) => {
  const { error, value } = loginSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({
      status: "error",
      message: error.details.map((err) => err.message),
    });
  }
  const user = await User.findOne({ email: value.email }).select("+password");
  if (!user) {
    return res
      .status(401)
      .json({ status: "error", message: "حدث خطأ اثناء تسجيل الدخول" });
  }
  const isUser = await bcrypt.compare(value.password, user.password);
  if (!isUser) {
    return res
      .status(401)
      .json({ status: "error", message: "حدث خطأ اثناء تسجيل الدخول" });
  }
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );

  res.status(200).json({
    status: "success",
    data: token,
  });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ status: "error", message: "User not found" });
  }
  res.status(200).json({ status: "success", data: user });
});

module.exports = { register, login, getMe };
