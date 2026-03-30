const express = require("express");
const { getProfile, updateProfile, getPublicProfile, deleteResume } = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.get("/profile", protect, getProfile);
router.get("/public/:id", getPublicProfile);
router.delete("/profile/resume", protect, deleteResume);
router.put(
  "/profile",
  protect,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "companyLogo", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  updateProfile
);

module.exports = router;
