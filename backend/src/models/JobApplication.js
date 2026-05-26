// Mongoose schema for job applications submitted by students.
import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
  {
    student_usn: String,
    student_name: String,
    student_email: String,
    job_id: mongoose.Schema.Types.ObjectId,
    alumni_email: String,
    posted_by: String,
    company: String,
    role: String,
    salary: String,
    location: String,
    resume_path: String,
    status: String,
    applied_at: mongoose.Schema.Types.Mixed,
  },
  {
    collection: "job_applications",
    versionKey: false,
    strict: false,
  }
);

jobApplicationSchema.index({ student_usn: 1, job_id: 1 }, { unique: true });

export default mongoose.model("JobApplication", jobApplicationSchema);
