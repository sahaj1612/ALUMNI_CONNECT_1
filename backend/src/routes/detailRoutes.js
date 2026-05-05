// Detail route used by the frontend to load a single job or event record
// for viewing on the detail page.
import { Router } from "express";

import Job from "../models/Job.js";
import Event from "../models/Event.js";
import { serialiseEvent, serialiseJob } from "../utils/formatters.js";

const router = Router();

router.get("/:type/:id", async (req, res) => {
  const { type, id } = req.params;

  if (!["job", "event"].includes(type)) {
    return res.status(400).json({ message: "Invalid detail type." });
  }

  const record = type === "job" ? await Job.findById(id) : await Event.findById(id);

  if (!record) {
    return res.status(404).json({ message: `The requested ${type} could not be found.` });
  }

  return res.json({
    type,
    record: type === "job" ? serialiseJob(record) : serialiseEvent(record),
  });
});

export default router;
