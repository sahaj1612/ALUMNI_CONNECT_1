// Authentication API routes for student and alumni login/logout/session checks.
import { Router } from "express";
import Student from "../models/Student.js";
import Alumni from "../models/Alumni.js";
import { serialiseAlumni, serialiseStudent } from "../utils/formatters.js";

const router = Router();

router.post("/student/login", async (req, res) => {
  const { susn, semail, spassword } = req.body;

  const student = await Student.findOne({
    usn: susn,
    email: semail,
    password: spassword,
  });

  if (!student) {
    return res.status(401).json({ message: "Invalid login credentials." });
  }

  req.session.studentUsn = student.usn;
  req.session.userType = "student";

  return res.json({
    message: "Login successful.",
    userType: "student",
    user: serialiseStudent(student),
  });
});

router.post("/alumni/login", async (req, res) => {
  const { email, password } = req.body;

  const alumni = await Alumni.findOne({
    email,
    password,
  });

  if (!alumni) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  req.session.alumniEmail = alumni.email;
  req.session.userType = "alumni";

  return res.json({
    message: "Login successful.",
    userType: "alumni",
    user: serialiseAlumni(alumni),
  });
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("alumni_connect_sid");
    res.json({ message: "Logged out successfully." });
  });
});

router.get("/me", async (req, res) => {
  if (req.session?.studentUsn) {
    const student = await Student.findOne({ usn: req.session.studentUsn });
    return res.json({
      authenticated: true,
      userType: "student",
      user: serialiseStudent(student),
    });
  }

  if (req.session?.alumniEmail) {
    const alumni = await Alumni.findOne({ email: req.session.alumniEmail });
    return res.json({
      authenticated: true,
      userType: "alumni",
      user: serialiseAlumni(alumni),
    });
  }

  return res.json({ authenticated: false });
});

export default router;
