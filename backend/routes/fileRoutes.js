const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middleware/authMiddleware");

const {
  getFiles,
  deleteFile,
  uploadFile,
  uploadMiddleware,
  updateDescription,
} = require("../controllers/fileController");

//Admin
router.get("/", protect, adminOnly, getFiles);
router.delete("/:id", protect, adminOnly, deleteFile);
router.put("/:id", protect, adminOnly, updateDescription);
router.post("/upload", protect, uploadMiddleware, uploadFile);

module.exports = router;