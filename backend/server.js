// Backend server entrypoint for AlumniConnect.
// This file configures middleware, session storage, upload routing,
// API routes, error handling, and starts the Express server.
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";

import { connectDatabase } from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import studentRoutes from "./src/routes/studentRoutes.js";
import alumniRoutes from "./src/routes/alumniRoutes.js";
import detailRoutes from "./src/routes/detailRoutes.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 5000;
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cookie sessions preserve the old "log in and stay inside the panel" flow.
app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "alumni_connect_sid",
    secret: process.env.SESSION_SECRET || "alumni_connect_secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/alumniConnectDB",
    }),
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// Reuse the shared project-level uploads folder so existing Mongo file paths keep working.
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/alumni", alumniRoutes);
app.use("/api/details", detailRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong on the server.",
  });
});

const startServer = async () => {
  await connectDatabase();
  app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start backend:", error);
  process.exit(1);
});
