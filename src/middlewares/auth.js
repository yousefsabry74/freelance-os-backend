const jwt = require("jsonwebtoken");
const User = require("../modules/auth/user.model");
const AppError = require("../utils/AppError");

const auth = async (req, res, next) => {
  const headers = req.headers.authorization;

  if (!headers || !headers.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ status: "error", message: "unauthorized access" });
  }

  const token = headers.split(" ")[1];

  try {
    const userInfo = jwt.verify(token, process.env.JWT_SECRET);
    req.user = userInfo;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ status: "error", message: "invalid or expired token" });
  }
};
module.exports = auth;
