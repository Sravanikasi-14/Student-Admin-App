// controllers/fileController.js

const File = require("../models/File");
const Token = require("../models/Token");
const { google } = require("googleapis");
const multer = require("multer");
const fs = require("fs");

// Multer
const upload = multer({ dest: "uploads/" });
exports.uploadMiddleware = upload.single("file");

// Helper: Google Drive
const getDrive = async () => {
  const token = await Token.findOne();

  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "http://localhost:5000/auth/google/callback"
  );

  oauth2Client.setCredentials({
    refresh_token: token.refresh_token,
  });

  return google.drive({ version: "v3", auth: oauth2Client });
};

// ================= GET FILES =================
exports.getFiles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;

    const drive = await getDrive();

    const files = await File.find()
      .sort({ uploadedAt: -1 })
      .skip(skip)
      .limit(limit);

    const validFiles = [];

    for (let file of files) {
      try {
        await drive.files.get({ fileId: file.fileId });
        validFiles.push(file);
      } catch {
        await File.findByIdAndDelete(file._id);
      }
    }

    const total = await File.countDocuments();

    res.json({
      files: validFiles,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching files" });
  }
};

// ================= DELETE =================
exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    const drive = await getDrive();

    await drive.files.delete({ fileId: file.fileId });
    await File.findByIdAndDelete(file._id);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

// ================= UPDATE DESCRIPTION (NEW) =================
exports.updateDescription = async (req, res) => {
  try {
    const { description } = req.body;

    const file = await File.findByIdAndUpdate(
      req.params.id,
      { description },
      { new: true }
    );

    res.json(file);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

// ================= UPLOAD =================
exports.uploadFile = async (req, res) => {
  try {
    const file = req.file;
    const description = req.body.description;

    const drive = await getDrive();

    const response = await drive.files.create({
      requestBody: {
        name: file.originalname,
      },
      media: {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.path),
      },
    });

    const fileId = response.data.id;

    await drive.permissions.create({
      fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    await File.create({
      fileId,
      fileName: file.originalname,
      description,
    });

    fs.unlinkSync(file.path);

    res.json({ message: "Uploaded successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Upload failed" });
  }
};