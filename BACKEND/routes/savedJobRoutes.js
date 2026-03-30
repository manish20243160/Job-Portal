const express = require("express");
const {
  saveJob,
  getSavedJobs,
  unsaveJob,
} = require("../controllers/savedJobController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", protect, getSavedJobs);
router.post("/:jobId", protect, saveJob);
router.delete("/:jobId", protect, unsaveJob);

module.exports = router;
