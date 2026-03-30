const Job = require("../models/Job");
const Application = require("../models/Application");
const SavedJob = require("../models/SavedJob");
const Analytics = require("../models/Analytics");

// CREATE job
exports.createJob = async (req, res) => {
  try {
    const { title, description, requirements, location, category, type, salaryMin, salaryMax } = req.body;

    const job = await Job.create({
      title,
      description,
      requirements,
      location,
      category,
      type,
      salaryMin,
      salaryMax,
      company: req.user._id,
    });

    // Update analytics
    await Analytics.findOneAndUpdate(
      { employer: req.user._id },
      { $inc: { totalJobsPosted: 1 } },
      { upsert: true, new: true }
    );

    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET all jobs (with filters)
exports.getJobs = async (req, res) => {
  try {
    const { keyword, location, category, type, salaryRange } = req.query;
    let filter = { isClosed: false };

    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { requirements: { $regex: keyword, $options: "i" } },
      ];
    }
    if (location) filter.location = { $regex: location, $options: "i" };
    if (category) filter.category = category;
    if (type) filter.type = type;

    if (salaryRange) {
      if (salaryRange === "Less than $1000") {
        filter.salaryMin = { $lt: 1000 };
      } else if (salaryRange === "$1000 - $15,000") {
        filter.salaryMin = { $gte: 1000 };
        filter.salaryMax = { $lte: 15000 };
      } else if (salaryRange === "More than $15,000") {
        filter.salaryMax = { $gt: 15000 };
      }
    }

    const jobs = await Job.find(filter)
      .populate("company", "name companyName companyLogo avatar")
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "company",
      "name companyName companyDescription companyLogo avatar email"
    );
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET employer's own jobs
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ company: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE job
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Prevent updating company field
    const { company, ...updateData } = req.body;

    const updated = await Job.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate("company", "name companyName companyLogo avatar");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Cascading delete: Remove all applications and saved entries for this job
    await Application.deleteMany({ job: job._id });
    await SavedJob.deleteMany({ job: job._id });

    await Job.findByIdAndDelete(req.params.id);

    // Update analytics
    await Analytics.findOneAndUpdate(
      { employer: req.user._id },
      { $inc: { totalJobsPosted: -1 } }
    );

    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CLOSE / OPEN job toggle
exports.toggleJobStatus = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    job.isClosed = !job.isClosed;
    await job.save();
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
