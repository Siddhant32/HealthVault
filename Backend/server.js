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
  res.json({ ok: true, database: mongoose.connection.readyState === 1 });
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/records", recordsRoutes);
app.use("/api/share", shareRoutes);
app.use("/api/copilot", copilotRoutes);
app.use("/api/doctors", doctorsRoutes);


const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("Missing MONGO_URI or JWT_SECRET in Backend/.env");
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });

  