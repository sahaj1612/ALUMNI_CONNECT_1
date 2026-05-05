// Mongoose schema for student profiles in the AlumniConnect database.
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    usn: String,
    email: String,
    password: String,
    name: String,
    phone: String,
    department: String,
    batch: String,
    skills: String,
    profile_photo: String,
    resume_path: String,
  },
  {
    collection: "students",
    versionKey: false,
    strict: false,
  }
);

export default mongoose.model("Student", studentSchema);
