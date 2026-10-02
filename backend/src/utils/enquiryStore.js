import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { memory } from "../db/memory.js";
import { persistEnquiry } from "../db/index.js";

const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "data");
const filePath = join(dir, "enquiries.json");

function ensureFile() {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  if (!existsSync(filePath)) writeFileSync(filePath, "[]\n", "utf-8");
}

function readFileList() {
  ensureFile();
  const raw = readFileSync(filePath, "utf-8").replace(/^\uFEFF/, "");
  return JSON.parse(raw);
}

function writeFileList(list) {
  ensureFile();
  writeFileSync(filePath, `${JSON.stringify(list, null, 2)}\n`, "utf-8");
}

export function listEnquiries() {
  if (memory.enabled && Array.isArray(memory.enquiries)) return memory.enquiries;
  return readFileList();
}

export async function addEnquiry(entry) {
  const row = {
    id: `enq-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...entry,
  };
  if (memory.enabled) {
    memory.enquiries = [row, ...(memory.enquiries || [])];
    await persistEnquiry(row);
  }
  const list = memory.enabled ? memory.enquiries : [row, ...readFileList().filter((item) => item.id !== row.id)];
  writeFileList(list);
  return row;
}
