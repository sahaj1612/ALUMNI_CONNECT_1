// Mongoose schema for job postings created by alumni.
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    company: String,
    role: String,
    salary: String,
    location: String,
    department: String,
    eligibility: String,
    description: String,
    posted_by: String,
    alumni_email: String,
    created_at: mongoose.Schema.Types.Mixed,
  },
  {
    collection: "jobs",
    versionKey: false,
    strict: false,
  }
);

export default mongoose.model("Job", jobSchema);
