const User = require("../models/User");
const fs = require("fs");
const path = require("path");
const upload = require("../middlewares/uploadMiddleware");

// GET current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE profile
exports.updateProfile = async (req, res) => {
  try {
    const { 
      name, companyName, companyDescription, 
      companyWebsite, location, industry,
      avatar, companyLogo, resume, bio, skills, experience 
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (companyName) user.companyName = companyName;
    if (companyDescription) user.companyDescription = companyDescription;
    if (companyWebsite) user.companyWebsite = companyWebsite;
    if (location) user.location = location;
    if (industry) user.industry = industry;
    if (bio) user.bio = bio;
    
    // Parse skills and experience if they are sent as JSON strings (common with multipart/form-data)
    if (skills) {
      user.skills = Array.isArray(skills) ? skills : JSON.parse(skills);
    }
    if (experience) {
      user.experience = Array.isArray(experience) ? experience : JSON.parse(experience);
    }

    // Handle avatar (prioritize file upload, fallback to body URL)
    if (req.files && req.files.avatar) {
      const avatarFile = req.files.avatar[0];
      user.avatar = `${req.protocol}://${req.get("host")}/uploads/images/${avatarFile.filename}`;
    } else if (avatar) {
      user.avatar = avatar;
    }

    // Handle company logo
    if (req.files && req.files.companyLogo) {
      const logoFile = req.files.companyLogo[0];
      user.companyLogo = `${req.protocol}://${req.get("host")}/uploads/images/${logoFile.filename}`;
    } else if (companyLogo) {
      user.companyLogo = companyLogo;
    }

    // Handle resume
    if (req.files && req.files.resume) {
      const resumeFile = req.files.resume[0];
      user.resume = `${req.protocol}://${req.get("host")}/uploads/resumes/${resumeFile.filename}`;
    } else if (resume) {
      user.resume = resume;
    }

    await user.save();
    const updatedUser = await User.findById(user._id).select("-password");
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE resume
exports.deleteResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.resume) {
      // Extract filename from URL
      const filename = user.resume.split("/").pop();
      const filePath = path.join(__dirname, "..", "uploads", "resumes", filename);
      
      // Delete from disk if exists
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      user.resume = "";
      await user.save();
    }

    res.json({ message: "Resume deleted successfully", resume: "" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET public profile by ID
exports.getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .lean();
      
    if (!user) return res.status(404).json({ message: "User not found" });
    
    // For employers, they can see resumes only if they are logged in (handled by middleware if needed)
    // Here we return the profile as is (without password)
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
