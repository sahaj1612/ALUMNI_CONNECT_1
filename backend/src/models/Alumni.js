// Mongoose schema for alumni profiles in the AlumniConnect database.
import mongoose from "mongoose";

const alumniSchema = new mongoose.Schema(
  {
    email: String,
    password: String,
    name: String,
    company: String,
    year: mongoose.Schema.Types.Mixed,
    profile_photo: String,
  },
  {
    collection: "alumni",
    versionKey: false,
    strict: false,
  }
);

export default mongoose.model("Alumni", alumniSchema);
