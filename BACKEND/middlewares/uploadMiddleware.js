const multer = require("multer");

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "avatar" || file.fieldname === "image" || file.fieldname === "companyLogo") {
      cb(null, "uploads/images");
    } else if (file.fieldname === "resume") {
      cb(null, "uploads/resumes");
    } else {
      cb(new Error("Invalid field name"), false);
    }
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, '-'));
  },
});

// File type filter
const fileFilter = (req, file, cb) => {
  const imageTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  const docTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];

  if (
    (file.fieldname === "avatar" || file.fieldname === "image" || file.fieldname === "companyLogo") &&
    imageTypes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else if (file.fieldname === "resume" && docTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images (JPG, PNG, WEBP) and Documents (PDF, DOC) are allowed"), false);
  }
};

// Upload middleware
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;