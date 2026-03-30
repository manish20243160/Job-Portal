const SavedJob = require("../models/SavedJob");
const Job = require("../models/Job");

// SAVE a job
exports.saveJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (req.user.role !== "jobseeker") {
      return res.status(403).json({ message: "Only job seekers can save jobs" });
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const alreadySaved = await SavedJob.findOne({
      jobseeker: req.user._id,
      job: jobId,
    });

    if (alreadySaved) {
      return res.status(400).json({ message: "Job already saved" });
    }

    const saved = await SavedJob.create({
      jobseeker: req.user._id,
      job: jobId,
    });

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET all saved jobs of current user
exports.getSavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ jobseeker: req.user._id })
      .populate({
        path: "job",
        populate: { path: "company", select: "name companyName companyLogo avatar" },
      })
      .sort({ createdAt: -1 });

    res.json(savedJobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UNSAVE a job
exports.unsaveJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const saved = await SavedJob.findOneAndDelete({
      jobseeker: req.user._id,
      job: jobId,
    });

    if (!saved) return res.status(404).json({ message: "Saved job not found" });

    res.json({ message: "Job removed from saved list" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
