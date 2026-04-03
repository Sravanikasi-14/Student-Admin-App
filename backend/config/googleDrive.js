const { google } = require("googleapis");

// authenticate using credentials.json
const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json", // 👈 must be in backend folder
  scopes: ["https://www.googleapis.com/auth/drive"],
});

// create drive instance
const drive = google.drive({
  version: "v3",
  auth,
});

module.exports = drive;