const express = require("express");
const router = express.Router();
const statsController = require("./stats.controller");
const auth = require("../../middlewares/auth");

router.use(auth);

router.get("/overview", statsController.getOverview);
router.get("/monthly", statsController.getMonthly);
router.get("/client/:id", statsController.getClientStats);

module.exports = router;
