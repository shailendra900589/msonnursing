import { Router } from "express";
import { getContent } from "../utils/contentStore.js";
import { addEnquiry } from "../utils/enquiryStore.js";
import { buildSitemapXml } from "../utils/sitemap.js";
import { buildLlmsTxt } from "../utils/llmsTxt.js";
import { buildSocialPreviewHtml, buildSocialPreviewJson } from "../utils/socialMeta.js";
import { resumeUpload, resumeUploadError } from "../middleware/resumeUpload.js";
import { cleanResumeLabel, removeResumeFile, resumeMime } from "../utils/resumeFiles.js";

const router = Router();

router.get("/content", (_req, res) => {
  res.json(getContent());
});

router.get("/services", (_req, res) => {
  res.json(getContent().services);
});

router.get("/services/:id", (req, res) => {
  const service = getContent().services.find((s) => s.id === req.params.id);
  if (!service) return res.status(404).json({ error: "Service not found" });
  res.json(service);
});

router.get("/contact", (_req, res) => {
  res.json(getContent().contact);
});

router.get("/posts", (_req, res) => {
  const posts = (getContent().posts || []).filter((p) => p.published !== false);
  res.json(posts);
});

router.get("/posts/:id", (req, res) => {
  const post = (getContent().posts || []).find((p) => p.id === req.params.id);
  if (!post || post.published === false) {
    return res.status(404).json({ error: "Post not found" });
  }
  res.json(post);
});

router.get("/events", (_req, res) => {
  const events = (getContent().events || []).filter((e) => e.published !== false);
  res.json(events);
});

router.get("/events/:id", (req, res) => {
  const event = (getContent().events || []).find((e) => e.id === req.params.id);
  if (!event || event.published === false) {
    return res.status(404).json({ error: "Event not found" });
  }
  res.json(event);
});

async function saveEnquiry(req, res) {
  const {
    name,
    phone,
    message,
    serviceId,
    serviceTitle,
    eventId,
    eventTitle,
    jobId,
    jobTitle,
    formType,
    formResponses,
    sourcePath,
    sourcePage,
  } = req.body || {};

  const trimmedName = name ? String(name).trim() : "";
  const trimmedPhone = phone ? String(phone).trim() : "";
  const trimmedMessage = message ? String(message).trim() : "";

  const isJob = Boolean(String(jobId || "").trim() || String(jobTitle || "").trim());
  if (isJob && !req.file) {
    return res.status(400).json({ error: "A resume (PDF, DOC, or DOCX) is required for job applications" });
  }
  if (!isJob && req.file) removeResumeFile(req.file.filename);

  if (!trimmedName && !trimmedPhone) {
    if (req.file && isJob) removeResumeFile(req.file.filename);
    return res.status(400).json({ error: "Name or phone is required" });
  }
  if (!trimmedMessage) {
    if (req.file && isJob) removeResumeFile(req.file.filename);
    return res.status(400).json({ error: "Message or registration details are required" });
  }

  let responses = {};
  if (formResponses && typeof formResponses === "object" && !Array.isArray(formResponses)) {
    responses = Object.fromEntries(
      Object.entries(formResponses).map(([k, v]) => [String(k), v == null ? "" : String(v).trim()])
    );
  }

  const row = await addEnquiry({
    name: trimmedName || "Visitor",
    phone: trimmedPhone,
    message: trimmedMessage,
    serviceId: serviceId ? String(serviceId) : "",
    serviceTitle: serviceTitle ? String(serviceTitle).trim() : "",
    eventId: eventId ? String(eventId) : "",
    eventTitle: eventTitle ? String(eventTitle).trim() : "",
    jobId: jobId ? String(jobId) : "",
    jobTitle: jobTitle ? String(jobTitle).trim() : "",
    formType: formType ? String(formType) : "",
    formResponses: responses,
    sourcePath: sourcePath ? String(sourcePath).trim() : "",
    sourcePage: sourcePage ? String(sourcePage).trim() : "",
    resumeFile: isJob && req.file ? req.file.filename : "",
    resumeName: isJob && req.file ? cleanResumeLabel(req.file.originalname) : "",
    resumeMime: isJob && req.file ? resumeMime(req.file.originalname) : "",
  });
  res.status(201).json({ ok: true, id: row.id });
}

router.post("/enquiries", (req, res) => {
  const type = String(req.headers["content-type"] || "");
  const done = (err) => {
    if (err) return res.status(400).json({ error: resumeUploadError(err) });
    saveEnquiry(req, res).catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Could not save enquiry" });
    });
  };
  if (!type.includes("multipart/form-data")) return done();
  resumeUpload(req, res, done);
});

/** Open Graph / Twitter preview HTML for social crawlers (use path query). */
router.get("/social-preview", (req, res) => {
  const path = req.query.path || "/";
  if (req.query.format === "json") {
    return res.json(buildSocialPreviewJson(path));
  }
  res.type("html").send(buildSocialPreviewHtml(path));
});

router.get("/sitemap.xml", (_req, res) => {
  const siteUrl = String(getContent().site?.url || process.env.SITE_URL || "https://www.msonnursing.com")
    .replace(/^(https?:\/\/)(?:www\.)?msonnursing\.com/i, "https://www.msonnursing.com");
  res.type("application/xml").send(buildSitemapXml(siteUrl));
});

router.get("/llms.txt", (_req, res) => {
  res.type("text/plain; charset=utf-8").send(buildLlmsTxt(getContent()));
});

router.get("/seo/:pageKey", (req, res) => {
  const content = getContent();
  const key = req.params.pageKey;
  if (key.startsWith("service-")) {
    const id = key.replace("service-", "");
    const service = content.services.find((s) => s.id === id);
    if (!service?.seo) return res.status(404).json({ error: "SEO not found" });
    return res.json({ ...content.seo.default, ...service.seo });
  }
  if (key.startsWith("post-")) {
    const id = key.replace("post-", "");
    const post = (content.posts || []).find((p) => p.id === id);
    if (!post?.seo) return res.status(404).json({ error: "SEO not found" });
    return res.json({ ...content.seo.default, ...post.seo });
  }
  if (key === "blog") {
    const pageSeo = content.seo?.pages?.blog;
    if (!pageSeo) return res.status(404).json({ error: "SEO not found" });
    return res.json({ ...content.seo.default, ...pageSeo });
  }
  if (key.startsWith("event-")) {
    const id = key.replace("event-", "");
    const event = (content.events || []).find((e) => e.id === id);
    if (!event?.seo) return res.status(404).json({ error: "SEO not found" });
    return res.json({ ...content.seo.default, ...event.seo });
  }
  if (key.startsWith("job-")) {
    const id = key.replace("job-", "");
    const job = (content.jobs || []).find((item) => item.id === id);
    if (!job) return res.status(404).json({ error: "SEO not found" });
    return res.json({
      ...content.seo.default,
      title: `${job.title} | ${content.site?.name || "Careers"}`,
      description: job.summary || job.description || "",
      canonicalPath: `/jobs/${job.id}`,
    });
  }
  if (key === "jobs") {
    const pageSeo = content.seo?.pages?.jobs;
    if (!pageSeo) return res.status(404).json({ error: "SEO not found" });
    return res.json({ ...content.seo.default, ...pageSeo });
  }
  if (key === "events") {
    const pageSeo = content.seo?.pages?.events;
    if (!pageSeo) return res.status(404).json({ error: "SEO not found" });
    return res.json({ ...content.seo.default, ...pageSeo });
  }
  const pageSeo = content.seo?.pages?.[key];
  if (!pageSeo) return res.status(404).json({ error: "SEO not found" });
  res.json({ ...content.seo.default, ...pageSeo });
});

export default router;
