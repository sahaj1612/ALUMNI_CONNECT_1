// Student panel API routes. Handles student dashboard data, applying for jobs,
// registering for events, marking notifications read, and profile updates.
import { Router } from "express";

import { requireStudent } from "../middleware/auth.js";
import Student from "../models/Student.js";
import Job from "../models/Job.js";
import Event from "../models/Event.js";
import JobApplication from "../models/JobApplication.js";
import EventRegistration from "../models/EventRegistration.js";
import Notification from "../models/Notification.js";
import { createNotification } from "../utils/notifications.js";
import { mixedProfileUpload, buildStoredPath } from "../utils/upload.js";
import {
  serialiseApplication,
  serialiseEvent,
  serialiseJob,
  serialiseNotification,
  serialiseRegistration,
  serialiseStudent,
} from "../utils/formatters.js";

const router = Router();

router.use(requireStudent);

router.get("/panel-data", async (req, res) => {
  const student = await Student.findOne({ usn: req.session.studentUsn });

  if (!student) {
    req.session.destroy(() => {});
    return res.status(404).json({ message: "Student not found." });
  }

  // The frontend consumes a single dashboard payload to keep rendering logic simple.
  const [jobs, events, appliedJobs, registeredEvents, notifications, unreadCount] =
    await Promise.all([
      Job.find().sort({ created_at: -1 }),
      Event.find().sort({ date: 1 }),
      JobApplication.find({ student_usn: student.usn }).sort({ applied_at: -1 }),
      EventRegistration.find({ student_usn: student.usn }).sort({ registered_at: -1 }),
      Notification.find({
        recipient_type: "student",
        recipient_id: student.usn,
      })
        .sort({ created_at: -1 })
        .limit(20),
      Notification.countDocuments({
        recipient_type: "student",
        recipient_id: student.usn,
        is_read: false,
      }),
    ]);

  return res.json({
    profile: serialiseStudent(student),
    jobs: jobs.map(serialiseJob),
    events: events.map(serialiseEvent),
    appliedJobs: appliedJobs.map(serialiseApplication),
    registeredEvents: registeredEvents.map(serialiseRegistration),
    notifications: notifications.map(serialiseNotification),
    counts: {
      availableJobs: jobs.length,
      upcomingEvents: events.length,
      appliedJobs: appliedJobs.length,
      registeredEvents: registeredEvents.length,
      unreadNotifications: unreadCount,
    },
  });
});

router.post("/jobs/:jobId/apply", async (req, res) => {
  const student = await Student.findOne({ usn: req.session.studentUsn });
  const job = await Job.findById(req.params.jobId);

  if (!student || !job) {
    return res.status(404).json({ message: "Selected job was not found." });
  }

  const existingApplication = await JobApplication.findOne({
    student_usn: student.usn,
    job_id: job._id,
  });

  if (existingApplication) {
    return res.status(400).json({ message: "You have already applied for this job." });
  }

  await JobApplication.create({
    student_usn: student.usn,
    student_name: student.name || "",
    student_email: student.email || "",
    job_id: job._id,
    alumni_email: job.alumni_email || "",
    posted_by: job.posted_by || "",
    company: job.company || "",
    role: job.role || "",
    salary: job.salary || "",
    location: job.location || "",
    resume_path: student.resume_path || "",
    status: "Applied",
    applied_at: new Date(),
  });

  if (job.alumni_email) {
    await createNotification({
      recipientType: "alumni",
      recipientId: String(job.alumni_email),
      title: "New job application",
      message: `${student.name || student.usn} applied for ${job.role || "your job"}.`,
      link: "/alumni-panel?section=applications",
    });
  }

  await createNotification({
    recipientType: "student",
    recipientId: student.usn,
    title: "Application submitted",
    message: `Your application for ${job.role || "the job"} has been submitted.`,
    link: "/student-panel?section=applied",
  });

  return res.json({ message: "Job application submitted successfully." });
});

router.post("/events/:eventId/register", async (req, res) => {
  const student = await Student.findOne({ usn: req.session.studentUsn });
  const event = await Event.findById(req.params.eventId);

  if (!student || !event) {
    return res.status(404).json({ message: "Selected event was not found." });
  }

  const existingRegistration = await EventRegistration.findOne({
    student_usn: student.usn,
    event_id: event._id,
  });

  if (existingRegistration) {
    return res.status(400).json({ message: "You have already registered for this event." });
  }

  await EventRegistration.create({
    student_usn: student.usn,
    student_name: student.name || "",
    student_email: student.email || "",
    event_id: event._id,
    event_title: event.title || "",
    event_date: event.date || "",
    location: event.location || "",
    alumni_email: event.alumni_email || "",
    status: "Registered",
    registered_at: new Date(),
  });

  if (event.alumni_email) {
    await createNotification({
      recipientType: "alumni",
      recipientId: String(event.alumni_email),
      title: "New event registration",
      message: `${student.name || student.usn} registered for ${event.title || "your event"}.`,
      link: "/alumni-panel?section=registrations",
    });
  }

  await createNotification({
    recipientType: "student",
    recipientId: student.usn,
    title: "Event registration confirmed",
    message: `You are registered for ${event.title || "the event"}.`,
    link: "/student-panel?section=registrations",
  });

  return res.json({ message: "Event registration successful." });
});

router.post("/notifications/mark-read", async (req, res) => {
  await Notification.updateMany(
    {
      recipient_type: "student",
      recipient_id: req.session.studentUsn,
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
  // Preserve the original profile fields from the PHP version while supporting file uploads.
  const updateData = {
    name: req.body.name || "",
    phone: req.body.phone || "",
    department: req.body.dept || "",
    batch: req.body.batch || "",
    skills: req.body.skills || "",
  };

  const profilePhoto = req.files?.profile_photo?.[0];
  const resume = req.files?.resume?.[0];

  if (profilePhoto) {
    const extension = profilePhoto.originalname.split(".").pop()?.toLowerCase() || "";
    if (!["jpg", "jpeg", "png", "webp"].includes(extension)) {
      return res.status(400).json({ message: "Invalid profile photo format." });
    }
    updateData.profile_photo = buildStoredPath(profilePhoto, "profile_photos");
  }

  if (resume) {
    const extension = resume.originalname.split(".").pop()?.toLowerCase() || "";
    if (!["pdf", "doc", "docx"].includes(extension)) {
      return res.status(400).json({ message: "Invalid resume format." });
    }
    updateData.resume_path = buildStoredPath(resume, "resumes");
  }

  await Student.updateOne({ usn: req.session.studentUsn }, { $set: updateData });
  const updatedStudent = await Student.findOne({ usn: req.session.studentUsn });

  return res.json({
    message: "Profile updated successfully.",
    profile: serialiseStudent(updatedStudent),
  });
});

export default router;
