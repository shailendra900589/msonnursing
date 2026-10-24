import { Router } from "express";
import { readdirSync, statSync, unlinkSync } from "fs";
import path from "path";
import { requireAdmin } from "../middleware/auth.js";
import { uploadMiddleware } from "../middleware/upload.js";
import { UPLOAD_FOLDERS, UPLOAD_ROOT, publicUploadUrl } from "../config/uploads.js";

const router = Router();

router.post("/", requireAdmin, (req, res) => {
  uploadMiddleware(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || "Upload failed" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No file received" });
    }
    const folder = req.uploadFolder || "images";
    res.status(201).json({
      url: publicUploadUrl(folder, req.file.filename),
      folder,
      filename: req.file.filename,
      size: req.file.size,
    });
  });
});

router.get("/media", requireAdmin, (_req, res) => {
  const items = [];
  for (const folder of UPLOAD_FOLDERS) {
    const dir = path.join(UPLOAD_ROOT, folder);
    let files = [];
    try {
      files = readdirSync(dir);
    } catch {
      continue;
    }
    for (const filename of files) {
      const full = path.join(dir, filename);
      if (!statSync(full).isFile()) continue;
      items.push({
        folder,
        filename,
        url: publicUploadUrl(folder, filename),
        size: statSync(full).size,
      });
    }
  }
  items.sort((a, b) => a.folder.localeCompare(b.folder));
  res.json(items);
});

router.delete("/media/:folder/:filename", requireAdmin, (req, res) => {
  const { folder, filename } = req.params;
  if (!UPLOAD_FOLDERS.includes(folder) || filename.includes("..") || filename.includes("/")) {
    return res.status(400).json({ error: "Invalid path" });
  }
  const full = path.join(UPLOAD_ROOT, folder, filename);
  try {
    unlinkSync(full);
    res.json({ ok: true });
  } catch {
    res.status(404).json({ error: "File not found" });
  }
});

export default router;
