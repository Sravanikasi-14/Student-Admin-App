require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const fileRoutes = require("./routes/fileRoutes");
const googleAuth = require("./routes/googleAuth");

const app = express();

// ✅ CORS (VERY IMPORTANT for frontend)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://student-admin-app-three.vercel.app",
    ],
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json());

// ✅ ROUTES (IMPORTANT FIX HERE)
app.use("/api/auth", authRoutes);   // 🔥 register + login
app.use("/api/files", fileRoutes);  // 🔥 file routes
app.use("/auth", googleAuth);       // 🔥 google oauth

// ✅ Test route
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

// ✅ MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

// ✅ Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});