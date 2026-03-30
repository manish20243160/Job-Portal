const Application = require("../models/Application");
const Job = require("../models/Job");
const Analytics = require("../models/Analytics");

// APPLY for a job
exports.applyJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.isClosed) return res.status(400).json({ message: "Job is closed" });

    const alreadyApplied = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });

    if (alreadyApplied) {
      return res.status(400).json({ message: "Already applied to this job" });
    }

    let resumeUrl = req.user.resume || "";
    if (req.file) {
      resumeUrl = `${req.protocol}://${req.get("host")}/uploads/resumes/${req.file.filename}`;
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      resume: resumeUrl,
    });

    // Update analytics for employer
    await Analytics.findOneAndUpdate(
      { employer: job.company },
      { $inc: { totalApplicationsReceived: 1 } },
      { upsert: true, new: true }
    );

    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET applications for a job (employer)
exports.getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const applications = await Application.find({ job: jobId })
      .populate("applicant", "name email avatar resume")
      .populate("job", "title")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET all applications for current employer (across all jobs)
exports.getAllEmployerApplications = async (req, res) => {
  try {
    const jobs = await Job.find({ company: req.user._id }).select("_id");
    const jobIds = jobs.map((j) => j._id);

    const applications = await Application.find({ job: { $in: jobIds } })
      .populate("applicant", "name email avatar resume")
      .populate("job", "title location type")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET my (job seeker) applications
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate({
        path: "job",
        populate: { path: "company", select: "name companyName companyLogo avatar" },
      })
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE application status (employer)
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate("job");

    if (!application) return res.status(404).json({ message: "Application not found" });

    if (application.job.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const prev = application.status;
    application.status = status;
    await application.save();

    // Update analytics if hired
    if (status === "Accepted" && prev !== "Accepted") {
      await Analytics.findOneAndUpdate(
        { employer: req.user._id },
        { $inc: { totalHired: 1 } },
        { upsert: true }
      );
    } else if (prev === "Accepted" && status !== "Accepted") {
      await Analytics.findOneAndUpdate(
        { employer: req.user._id },
        { $inc: { totalHired: -1 } }
      );
    }

    res.json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single application by ID
exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("applicant", "name email avatar bio skills experience resume")
      .populate("job", "title company location type");

    if (!application) return res.status(404).json({ message: "Application not found" });

    // Auth check: requester must be the applicant OR the employer who posted the job
    const isApplicant = application.applicant._id.toString() === req.user._id.toString();
    const isEmployer = application.job.company.toString() === req.user._id.toString();

    if (!isApplicant && !isEmployer) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
