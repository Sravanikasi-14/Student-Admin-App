const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const Token = require("../models/Token");

// ✅ CREATE CLIENT HERE (GLOBAL)
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "http://localhost:5000/auth/google/callback"
);

// STEP 1: Redirect to Google
router.get("/google", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/drive.file"],
    prompt: "consent",
  });

  res.redirect(url);
});

// STEP 2: Callback
router.get("/google/callback", async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.send("No code received");
    }

    const { tokens } = await oauth2Client.getToken(code);

    // ✅ SET CREDENTIALS
    oauth2Client.setCredentials(tokens);

    // ✅ SAVE TOKENS
    await Token.deleteMany();
    await Token.create(tokens);

    res.send("Google Drive connected successfully!");
  } catch (err) {
    console.error("OAuth Error:", err);
    res.send("OAuth failed");
  }
});

module.exports = router;