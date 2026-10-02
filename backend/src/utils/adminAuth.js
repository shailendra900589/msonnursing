import { createHash } from "crypto";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { memory } from "../db/memory.js";
import { persistAdminHash } from "../db/index.js";

const filePath = join(dirname(fileURLToPath(import.meta.url)), "..", "data", "admin-secret.json");
const FALLBACK = process.env.ADMIN_PASSWORD || "admin123";

function hashPassword(password) {
  return createHash("sha256").update(String(password)).digest("hex");
}

function storedHash() {
  if (memory.enabled && memory.adminHash) return memory.adminHash;
  if (!existsSync(filePath)) return "";
  try {
    const data = JSON.parse(readFileSync(filePath, "utf-8"));
    return typeof data.hash === "string" ? data.hash : "";
  } catch {
    return "";
  }
}

export function verifyAdminPassword(password) {
  const saved = storedHash();
  if (saved) return hashPassword(password) === saved;
  return String(password) === FALLBACK;
}

export async function updateAdminPassword(currentPassword, newPassword) {
  if (!verifyAdminPassword(currentPassword)) {
    return { ok: false, error: "Current password is incorrect" };
  }
  const next = String(newPassword || "");
  if (next.length < 6) {
    return { ok: false, error: "New password must be at least 6 characters" };
  }
  if (next === String(currentPassword)) {
    return { ok: false, error: "Choose a different password" };
  }
  const hash = hashPassword(next);
  writeFileSync(filePath, `${JSON.stringify({ hash }, null, 2)}\n`, "utf-8");
  if (memory.enabled) await persistAdminHash(hash);
  return { ok: true };
}
