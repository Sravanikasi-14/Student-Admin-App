const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  fileId: String,
  fileName: String,
  description: String, // ✅ ADD THIS
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("File", fileSchema);