require("dotenv").config();
const express = require("express");
const cors=require("cors")
const session=require("express-session");
const MongoStore = require('connect-mongo');
const mongoose = require("mongoose");
require("./models/user.js");
const authRoutes = require("./routes/authRoute");
const app = express();
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET || "your_super_secret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
  }
}));
app.use(express.json({ limit: "10mb" }));
app.use("/api", authRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));