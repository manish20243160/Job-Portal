const Analytics = require("../models/Analytics");
const Job = require("../models/Job");
const Application = require("../models/Application");

// GET employer analytics dashboard
exports.getEmployerAnalytics = async (req, res) => {
  try {
    let analytics = await Analytics.findOne({ employer: req.user._id });

    if (!analytics) {
      // Create fresh analytics from live data
      const totalJobsPosted = await Job.countDocuments({ company: req.user._id });
      const jobs = await Job.find({ company: req.user._id }).select("_id");
      const jobIds = jobs.map((j) => j._id);

      const totalApplicationsReceived = await Application.countDocuments({
        job: { $in: jobIds },
      });
      const totalHired = await Application.countDocuments({
        job: { $in: jobIds },
        status: "Accepted",
      });

      analytics = await Analytics.create({
        employer: req.user._id,
        totalJobsPosted,
        totalApplicationsReceived,
        totalHired,
      });
    }

    // Recent 5 jobs
    const recentJobs = await Job.find({ company: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title location type isClosed createdAt");

    // Recent 5 applications
    const jobs = await Job.find({ company: req.user._id }).select("_id");
    const jobIds = jobs.map((j) => j._id);
    const recentApplications = await Application.find({ job: { $in: jobIds } })
      .populate("applicant", "name email avatar")
      .populate("job", "title")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({ analytics, recentJobs, recentApplications });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET job seeker analytics dashboard
exports.getJobSeekerAnalytics = async (req, res) => {
  try {
    const totalApplied = await Application.countDocuments({ applicant: req.user._id });
    
    const SavedJob = require("../models/SavedJob"); // Dynamic import to avoid cycles if any
    const totalSaved = await SavedJob.countDocuments({ jobseeker: req.user._id });

    // Status Breakdown
    const stats = await Application.aggregate([
      { $match: { applicant: req.user._id } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const statusBreakdown = {
      Applied: 0,
      "In Review": 0,
      Accepted: 0,
      Rejected: 0,
    };
    stats.forEach((s) => {
      statusBreakdown[s._id] = s.count;
    });

    // Recent 5 applications
    const recentApplications = await Application.find({ applicant: req.user._id })
      .populate({
        path: "job",
        select: "title",
        populate: { path: "company", select: "name companyName companyLogo avatar" },
      })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalApplied,
      totalSaved,
      statusBreakdown,
      recentApplications,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
