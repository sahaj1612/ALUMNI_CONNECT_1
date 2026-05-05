// Authentication middleware used by protected backend routes.
// requireStudent guards student-only APIs, requireAlumni guards alumni-only APIs.
export const requireStudent = (req, res, next) => {
  if (!req.session?.studentUsn) {
    return res.status(401).json({ message: "Student login required." });
  }

  return next();
};

export const requireAlumni = (req, res, next) => {
  if (!req.session?.alumniEmail) {
    return res.status(401).json({ message: "Alumni login required." });
  }

  return next();
};
