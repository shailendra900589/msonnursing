import multer from "multer";
import path from "path";
import { randomUUID } from "crypto";
import { UPLOAD_ROOT, UPLOAD_FOLDERS } from "../config/uploads.js";

const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"]);

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const folder = UPLOAD_FOLDERS.includes(req.body?.folder) ? req.body.folder : "images";
    req.uploadFolder = folder;
    cb(null, path.join(UPLOAD_ROOT, folder));
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${randomUUID()}${ext}`);
  },
});

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXT.has(ext)) {
      return cb(new Error("Only JPG, PNG, WEBP, GIF, and SVG images are allowed"));
    }
    cb(null, true);
  },
}).single("file");
