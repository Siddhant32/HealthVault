
import dotenv from "dotenv";
import mongoose from "mongoose";
import Doctor from "./models/Doctor.js";

dotenv.config();

const doctors = [
  {
    name: "Dr. Demo Sharma",
    specialty: "General Physician",
    clinicName: "Demo Health Clinic",
    address: "Demo Road, Virar West",
    city: "Virar",
    experienceYears: 5,
    consultationFee: 400,
    phone: "",
    isActive: true
  },
  {
    name: "Dr. Demo Patel",
    specialty: "Dermatologist",
    clinicName: "Demo Skin Clinic",
    address: "Demo Market, Virar East",
    city: "Virar",
    experienceYears: 7,
    consultationFee: 600,
    phone: "",
    isActive: true
  },
  {
    name: "Dr. Demo Mehta",
    specialty: "Cardiologist",
    clinicName: "Demo Heart Centre",
    address: "Demo Avenue, Mumbai",
    city: "Mumbai",
    experienceYears: 10,
    consultationFee: 800,
    phone: "",
    isActive: true
  }
];

async function seedDoctors() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from Backend/.env");
    }

    await mongoose.connect(process.env.MONGO_URI);

    for (const doctor of doctors) {
      await Doctor.updateOne(
        {
          name: doctor.name,
          clinicName: doctor.clinicName,
          city: doctor.city
        },
        { $set: doctor },
        { upsert: true }
      );
    }

    console.log("Demo doctors added or updated successfully.");
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedDoctors();
