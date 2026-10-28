
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const { clerkMiddleware } = require("@clerk/express");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://deplo-smart-complaint-management-sy.vercel.app",
  "https://smartcomplaintmanagementsystem-p5w0fm92x-mayur-a198.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use(
  clerkMiddleware({
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
  })
);

app.get("/", (req, res) => {
  res.send("Smart Complaint Backend is running!");
});

app.use("/api/complaints", require("./routes/complaintroutes"));

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
