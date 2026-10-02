import multer from "multer";
import { ensureResumeDir, isAllowedResume, storedResumeName } from "../utils/resumeFiles.js";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, ensureResumeDir());
  },
  filename: (_req, file, cb) => {
    cb(null, storedResumeName(file.originalname));
  },
});

export const resumeUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!isAllowedResume(file.originalname)) {
      return cb(new Error("Resume must be a PDF, DOC, or DOCX file"));
    }
    cb(null, true);
  },
}).single("resume");

export function resumeUploadError(err) {
  if (!err) return "";
  if (err.code === "LIMIT_FILE_SIZE") return "Resume must be 5 MB or smaller";
  return err.message || "Could not upload resume";
}
