const express = require("express");
const router = express.Router();
const { getEmployerAnalytics, getJobSeekerAnalytics } = require("../controllers/analyticsController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/employer", protect, getEmployerAnalytics);
router.get("/jobseeker", protect, getJobSeekerAnalytics);

module.exports = router;
