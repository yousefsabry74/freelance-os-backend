const express = require("express");
const router = express.Router();
const earningsController = require("./earnings.controller");
const auth = require("../../middlewares/auth");

router.use(auth);

router.post("/", earningsController.createEarning);
router.get("/summary", earningsController.getSummary);
router.get("/by-platform", earningsController.getByPlatform);
router.get("/monthly", earningsController.getMonthly);

module.exports = router;
