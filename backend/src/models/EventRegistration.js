// Mongoose schema for event registrations made by students.
import mongoose from "mongoose";

const eventRegistrationSchema = new mongoose.Schema(
  {
    student_usn: String,
    student_name: String,
    student_email: String,
    event_id: mongoose.Schema.Types.ObjectId,
    event_title: String,
    event_date: mongoose.Schema.Types.Mixed,
    location: String,
    alumni_email: String,
    status: String,
    registered_at: mongoose.Schema.Types.Mixed,
  },
  {
    collection: "event_registrations",
    versionKey: false,
    strict: false,
  }
);

export default mongoose.model("EventRegistration", eventRegistrationSchema);
