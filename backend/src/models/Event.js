// Mongoose schema for events posted by alumni.
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: String,
    date: mongoose.Schema.Types.Mixed,
    location: String,
    description: String,
    posted_by: String,
    alumni_email: String,
    created_at: mongoose.Schema.Types.Mixed,
  },
  {
    collection: "events",
    versionKey: false,
    strict: false,
  }
);

export default mongoose.model("Event", eventSchema);
