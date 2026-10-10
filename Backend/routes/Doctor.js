
import express from "express";
import auth from "../middleware/auth.js";
import Doctor from "../models/Doctor.js";

const router = express.Router();

// Escape search input so special regex characters are treated as plain text.
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

router.get("/", auth, async (req, res) => {
  try {
    const { search = "", specialty = "" } = req.query;

    const filter = { isActive: true };

    if (specialty.trim()) {
      filter.specialty = {
        $regex: escapeRegex(specialty.trim()),
        $options: "i"
      };
    }

    if (search.trim()) {
      const term = search.trim();
      filter.$or = [
        { name: { $regex: escapeRegex(term), $options: "i" } },
        { clinicName: { $regex: escapeRegex(term), $options: "i" } },
        { address: { $regex: escapeRegex(term), $options: "i" } },
        { city: { $regex: escapeRegex(term), $options: "i" } },
        { specialty: { $regex: escapeRegex(term), $options: "i" } }
      ];
    }

    const doctors = await Doctor.find(filter)
      .sort({ name: 1 })
      .limit(50)
      .lean();

    res.json({ doctors });
  } catch (error) {
    console.error("Doctor search error:", error);
    res.status(500).json({
      message: "Could not load doctors"
    });
  }
});

export default router;
