import { mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
export const UPLOAD_ROOT = join(root, "uploads");

export const UPLOAD_FOLDERS = ["logos", "images", "services", "seo", "events"];

export function ensureUploadDirs() {
  mkdirSync(UPLOAD_ROOT, { recursive: true });
  for (const folder of UPLOAD_FOLDERS) {
    mkdirSync(join(UPLOAD_ROOT, folder), { recursive: true });
  }
}

export function publicUploadUrl(folder, filename) {
  return `/uploads/${folder}/${filename}`;
}
