const express = require("express");
const {
  applyJob,
  getJobApplications,
  getAllEmployerApplications,
  getMyApplications,
  updateStatus,
  getApplicationById,
} = require("../controllers/applicationController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.post("/:jobId/apply", protect, upload.single("resume"), applyJob);
router.get("/my-applications", protect, getMyApplications);
router.get("/employer-applications", protect, getAllEmployerApplications);
router.get("/detail/:id", protect, getApplicationById);
router.get("/:jobId", protect, getJobApplications);
router.patch("/:id/status", protect, updateStatus);

module.exports = router;
