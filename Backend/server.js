import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import recordsRoutes from "./routes/records.js";
import shareRoutes from "./routes/share.js";
import copilotRoutes from "./routes/copilot.js";
import doctorsRoutes from "./routes/Doctor.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, ".env") });

const app = express();
app.set("trust proxy", 1);
app.use(cors({ origin: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Healthcare API is running" });
});

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    database: mongoose.connection.readyState === 1,
    copilotConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

function requireDatabase(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: "This feature is unavailable because the database is not connected.",
    });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(503).json({
      message: "Account authentication is not configured on this server.",
    });
  }

  return next();
}

app.use("/api/auth", requireDatabase, authRoutes);
app.use("/api/profile", requireDatabase, profileRoutes);
app.use("/api/records", requireDatabase, recordsRoutes);
app.use("/api/share", requireDatabase, shareRoutes);
app.use("/api/copilot", copilotRoutes);
app.use("/api/doctors", requireDatabase, doctorsRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);

  if (!process.env.MONGO_URI) {
    console.log(
      "MONGO_URI is not configured. Starting in demo mode; database-backed routes will be unavailable.",
    );
    return;
  }

  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch(() => {
      console.error(
        "MongoDB connection failed. The server remains available for demo Copilot; database-backed routes return 503.",
      );
    });
});