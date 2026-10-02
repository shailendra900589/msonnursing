import { existsSync } from "fs";
import { Router } from "express";
import { getContent, saveContent } from "../utils/contentStore.js";
import { listEnquiries } from "../utils/enquiryStore.js";
import { requireAdmin, signAdminToken } from "../middleware/auth.js";
import { updateAdminPassword, verifyAdminPassword } from "../utils/adminAuth.js";
import { resumeAbsolutePath, resumeMime } from "../utils/resumeFiles.js";

const router = Router();

router.post("/login", (req, res) => {
  const { password } = req.body || {};
  if (!verifyAdminPassword(password)) {
    return res.status(401).json({ error: "Invalid password" });
  }
  res.json({ token: signAdminToken() });
});

router.put("/password", requireAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    const result = await updateAdminPassword(currentPassword, newPassword);
    if (!result.ok) return res.status(400).json({ error: result.error });
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update password" });
  }
});

router.get("/content", requireAdmin, (_req, res) => {
  res.json(getContent());
});

router.get("/enquiries", requireAdmin, (_req, res) => {
  res.json(listEnquiries());
});

router.get("/enquiries/:id/resume", requireAdmin, (req, res) => {
  const row = listEnquiries().find((item) => item.id === req.params.id);
  if (!row?.resumeFile) return res.status(404).json({ error: "No resume on this enquiry" });
  const filePath = resumeAbsolutePath(row.resumeFile);
  if (!filePath || !existsSync(filePath)) return res.status(404).json({ error: "Resume file is missing" });

  const label = String(row.resumeName || "resume").replace(/["\r\n]/g, "");
  const encoded = encodeURIComponent(label);
  const download = req.query.download === "1";
  res.setHeader("Content-Type", row.resumeMime || resumeMime(row.resumeName || row.resumeFile));
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader(
    "Content-Disposition",
    `${download ? "attachment" : "inline"}; filename="${label}"; filename*=UTF-8''${encoded}`
  );
  res.sendFile(filePath);
});

router.put("/content", requireAdmin, async (req, res) => {
  try {
    const body = req.body;
    if (!body || typeof body !== "object" || !body.site || !Array.isArray(body.services)) {
      return res.status(400).json({ error: "Invalid content payload (requires site + services[])" });
    }
    if (!body.navigation) body.navigation = { main: [], footer: [] };
    if (!body.seo) body.seo = { default: {}, pages: {} };
    if (!Array.isArray(body.events)) body.events = [];
    if (!Array.isArray(body.posts)) body.posts = [];
    if (!Array.isArray(body.jobs)) body.jobs = [];
    res.json(await saveContent(body));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not save content" });
  }
});

export default router;
