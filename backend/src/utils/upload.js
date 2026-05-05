// File upload helpers for storing profile photos and resumes.
// Uses multer to handle multipart form uploads and moves files into the shared uploads directory.
import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsRoot = path.resolve(__dirname, "../../../uploads");

const ensureFolder = (folder) => {
  const absoluteFolder = path.join(uploadsRoot, folder);
  fs.mkdirSync(absoluteFolder, { recursive: true });
  return absoluteFolder;
};

const createStorage = (folder) =>
  multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, ensureFolder(folder));
    },
    filename: (_req, file, cb) => {
      const safeName = `${folder}_${Date.now()}_${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
      cb(null, safeName);
    },
  });

// The React profile forms still submit the same two file fields as before.
export const mixedProfileUpload = multer({
  storage: createStorage("temp"),
}).fields([
  { name: "profile_photo", maxCount: 1 },
  { name: "resume", maxCount: 1 },
]);

export const buildStoredPath = (file, targetFolder) => {
  if (!file) {
    return "";
  }

  const finalFolder = ensureFolder(targetFolder);
  const finalPath = path.join(finalFolder, file.filename);

  if (file.path !== finalPath) {
    fs.renameSync(file.path, finalPath);
  }

  return `uploads/${targetFolder}/${file.filename}`;
};
