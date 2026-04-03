require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const googleAuth = require("./routes/googleAuth");
const fileRoutes = require("./routes/fileRoutes");

const app = express();

// ✅ CORS (allow frontend)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://your-frontend.vercel.app", // replace later
    ],
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/auth", googleAuth);

// Test
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

// DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

// Start
app.listen(process.env.PORT || 5000, () => {
  console.log("Server running 🚀");
});