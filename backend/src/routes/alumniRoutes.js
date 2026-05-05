// Alumni panel API routes. Handles job/event management, application status,
// notifications, and alumni profile updates.
import { Router } from "express";

import { requireAlumni } from "../middleware/auth.js";
import Alumni from "../models/Alumni.js";
import Student from "../models/Student.js";
import Job from "../models/Job.js";
import Event from "../models/Event.js";
import JobApplication from "../models/JobApplication.js";
import EventRegistration from "../models/EventRegistration.js";
import Notification from "../models/Notification.js";
import { createBulkNotifications, createNotification } from "../utils/notifications.js";
import { mixedProfileUpload, buildStoredPath } from "../utils/upload.js";
import {
  serialiseAlumni,
  serialiseApplication,
  serialiseEvent,
  serialiseJob,
  serialiseNotification,
  serialiseRegistration,
} from "../utils/formatters.js";

const router = Router();

router.use(requireAlumni);

router.get("/panel-data", async (req, res) => {
  const alumni = await Alumni.findOne({ email: req.session.alumniEmail });

  if (!alumni) {
    req.session.destroy(() => {});
    return res.status(404).json({ message: "Alumni profile not found." });
  }

  // This bundles the same collections the PHP alumni panel used into one API response.
  const [postedJobs, postedEvents, notifications, unreadCount] = await Promise.all([
    Job.find({ alumni_email: alumni.email }).sort({ created_at: -1 }),
    Event.find({ alumni_email: alumni.email }).sort({ created_at: -1 }),
    Notification.find({
      recipient_type: "alumni",
      recipient_id: alumni.email,
    })
      .sort({ created_at: -1 })
      .limit(20),
    Notification.countDocuments({
      recipient_type: "alumni",
      recipient_id: alumni.email,
      is_read: false,
    }),
  ]);

  const jobIds = postedJobs.map((job) => job._id);
  const eventIds = postedEvents.map((event) => event._id);

  const [applications, registrations] = await Promise.all([
    jobIds.length
      ? JobApplication.find({ job_id: { $in: jobIds } }).sort({ applied_at: -1 })
      : [],
    eventIds.length
      ? EventRegistration.find({ event_id: { $in: eventIds } }).sort({ registered_at: -1 })
      : [],
  ]);

  return res.json({
    profile: serialiseAlumni(alumni),
    jobs: postedJobs.map(serialiseJob),
    events: postedEvents.map(serialiseEvent),
    applications: applications.map(serialiseApplication),
    registrations: registrations.map(serialiseRegistration),
    notifications: notifications.map(serialiseNotification),
    counts: {
      jobs: postedJobs.length,
      events: postedEvents.length,
      applications: applications.length,
      registrations: registrations.length,
      unreadNotifications: unreadCount,
    },
  });
});

router.post("/jobs", async (req, res) => {
  const alumni = await Alumni.findOne({ email: req.session.alumniEmail });
  if (!alumni) {
    return res.status(404).json({ message: "Alumni profile not found." });
  }

  await Job.create({
    company: (req.body.company || alumni.company || "").trim(),
    role: (req.body.role || "").trim(),
    salary: (req.body.salary || "").trim(),
    location: (req.body.location || "").trim(),
    department: (req.body.department || "").trim(),
    eligibility: (req.body.eligibility || "").trim(),
    description: (req.body.description || "").trim(),
    posted_by: alumni.name || "",
    alumni_email: alumni.email,
    created_at: new Date(),
  });

  const studentIds = await Student.distinct("usn");
  await createBulkNotifications({
    recipientType: "student",
    recipientIds: studentIds,
    title: "New job posted",
    message: `${(req.body.company || alumni.company || alumni.name || "An alumni").trim()} posted a new job: ${(req.body.role || "").trim()}`,
    link: "/student-panel?section=jobs",
  });

  return res.json({ message: "Job posted successfully." });
});

router.put("/jobs/:jobId", async (req, res) => {
  const alumni = await Alumni.findOne({ email: req.session.alumniEmail });
  const updated = await Job.findOneAndUpdate(
    {
      _id: req.params.jobId,
      alumni_email: alumni.email,
    },
    {
      $set: {
        company: (req.body.company || alumni.company || "").trim(),
        role: (req.body.role || "").trim(),
        salary: (req.body.salary || "").trim(),
        location: (req.body.location || "").trim(),
        department: (req.body.department || "").trim(),
        eligibility: (req.body.eligibility || "").trim(),
        description: (req.body.description || "").trim(),
      },
    },
    { new: true }
  );

  if (!updated) {
    return res.status(404).json({ message: "Unable to update job." });
  }

  return res.json({ message: "Job updated successfully." });
});

router.delete("/jobs/:jobId", async (req, res) => {
  const alumni = await Alumni.findOne({ email: req.session.alumniEmail });
  const deletedJob = await Job.findOneAndDelete({
    _id: req.params.jobId,
    alumni_email: alumni.email,
  });

  if (!deletedJob) {
    return res.status(404).json({ message: "Unable to delete job." });
  }

  await JobApplication.deleteMany({ job_id: deletedJob._id });
  return res.json({ message: "Job deleted successfully." });
});

router.post("/events", async (req, res) => {
  const alumni = await Alumni.findOne({ email: req.session.alumniEmail });
  if (!alumni) {
    return res.status(404).json({ message: "Alumni profile not found." });
  }

  await Event.create({
    title: (req.body.title || "").trim(),
    date: req.body.event_date || "",
    location: (req.body.location || "").trim(),
    description: (req.body.description || "").trim(),
    posted_by: alumni.name || "",
    alumni_email: alumni.email,
    created_at: new Date(),
  });

  const studentIds = await Student.distinct("usn");
  await createBulkNotifications({
    recipientType: "student",
    recipientIds: studentIds,
    title: "New event posted",
    message: `${alumni.name || "An alumni"} posted a new event: ${(req.body.title || "").trim()}`,
    link: "/student-panel?section=events",
  });

  return res.json({ message: "Event posted successfully." });
});

router.put("/events/:eventId", async (req, res) => {
  const updated = await Event.findOneAndUpdate(
    {
      _id: req.params.eventId,
      alumni_email: req.session.alumniEmail,
    },
    {
      $set: {
        title: (req.body.title || "").trim(),
        date: req.body.event_date || "",
        location: (req.body.location || "").trim(),
        description: (req.body.description || "").trim(),
      },
    },
    { new: true }
  );

  if (!updated) {
    return res.status(404).json({ message: "Unable to update event." });
  }

  return res.json({ message: "Event updated successfully." });
});

router.delete("/events/:eventId", async (req, res) => {
  const deletedEvent = await Event.findOneAndDelete({
    _id: req.params.eventId,
    alumni_email: req.session.alumniEmail,
  });

  if (!deletedEvent) {
    return res.status(404).json({ message: "Unable to delete event." });
  }

  await EventRegistration.deleteMany({ event_id: deletedEvent._id });
  return res.json({ message: "Event deleted successfully." });
});

router.patch("/applications/:applicationId/status", async (req, res) => {
  const allowedStatuses = ["Applied", "Reviewed", "Shortlisted", "Rejected", "Selected"];
  const { status } = req.body;

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid application status." });
  }

  const application = await JobApplication.findByIdAndUpdate(
    req.params.applicationId,
    {
      $set: { status },
    },
    { new: true }
  );

  if (!application) {
    return res.status(404).json({ message: "Unable to update application status." });
  }

  if (application.student_usn) {
    await createNotification({
      recipientType: "student",
      recipientId: String(application.student_usn),
      title: "Application status updated",
      message: `Your application for ${application.role || "the job"} is now ${status}.`,
      link: "/student-panel?section=applied",
    });
  }

  return res.json({ message: "Application status updated." });
});

router.post("/notifications/mark-read", async (req, res) => {
  await Notification.updateMany(
    {
      recipient_type: "alumni",
      recipient_id: req.session.alumniEmail,
      is_read: false,
    },
    {
      $set: {
        is_read: true,
      },
    }
  );

  return res.json({ message: "Notifications marked as read." });
});

router.put("/profile", mixedProfileUpload, async (req, res) => {
  const updateData = {
    name: req.body.name || "",
    company: req.body.company || "",
    year: req.body.year || "",
  };

  const profilePhoto = req.files?.profile_photo?.[0];
  if (profilePhoto) {
    const extension = profilePhoto.originalname.split(".").pop()?.toLowerCase() || "";
    if (!["jpg", "jpeg", "png", "webp"].includes(extension)) {
      return res.status(400).json({ message: "Invalid profile photo format." });
    }
    updateData.profile_photo = buildStoredPath(profilePhoto, "profile_photos");
  }

  await Alumni.updateOne({ email: req.session.alumniEmail }, { $set: updateData });
  const updatedAlumni = await Alumni.findOne({ email: req.session.alumniEmail });

  return res.json({
    message: "Profile updated successfully.",
    profile: serialiseAlumni(updatedAlumni),
  });
});

export default router;
