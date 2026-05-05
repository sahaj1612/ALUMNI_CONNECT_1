// Mongoose schema for notifications delivered to users.
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient_type: String,
    recipient_id: String,
    title: String,
    message: String,
    link: String,
    is_read: Boolean,
    created_at: mongoose.Schema.Types.Mixed,
  },
  {
    collection: "notifications",
    versionKey: false,
    strict: false,
  }
);

export default mongoose.model("Notification", notificationSchema);
