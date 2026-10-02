import { mkdirSync, unlinkSync } from "fs";
import { randomUUID } from "crypto";
import { basename, dirname, extname, join, relative, resolve } from "path";
import { fileURLToPath } from "url";

const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "data", "resumes");

const ALLOWED = new Map([
  [".pdf", "application/pdf"],
  [".doc", "application/msword"],
  [".docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
]);

export function ensureResumeDir() {
  mkdirSync(dir, { recursive: true });
  return dir;
}

export function resumeExtension(filename) {
  return extname(String(filename || "")).toLowerCase();
}

export function isAllowedResume(filename) {
  return ALLOWED.has(resumeExtension(filename));
}

export function resumeMime(filename) {
  return ALLOWED.get(resumeExtension(filename)) || "application/octet-stream";
}

export function storedResumeName(originalName) {
  const ext = resumeExtension(originalName);
  return `${randomUUID()}${ext}`;
}

export function cleanResumeLabel(originalName) {
  const ext = resumeExtension(originalName);
  const base = basename(String(originalName || `resume${ext}`))
    .replace(/[^\w.\- ()]+/g, "_")
    .slice(0, 160);
  if (!base || !base.toLowerCase().endsWith(ext)) return `resume${ext || ".pdf"}`;
  return base;
}

export function resumeAbsolutePath(storedName) {
  const safe = basename(String(storedName || ""));
  if (!/^[a-f0-9-]+\.(pdf|doc|docx)$/i.test(safe)) return null;
  const full = resolve(dir, safe);
  const rel = relative(resolve(dir), full);
  if (!rel || rel.startsWith("..") || rel.includes("..")) return null;
  return full;
}

export function removeResumeFile(storedName) {
  const full = resumeAbsolutePath(storedName);
  if (!full) return;
  try {
    unlinkSync(full);
  } catch {
    /* already gone */
  }
}
