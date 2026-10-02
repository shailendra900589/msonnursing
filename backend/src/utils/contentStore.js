import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { mergeContent } from "../data/defaults.js";
import { memory } from "../db/memory.js";

const contentPath = join(dirname(fileURLToPath(import.meta.url)), "..", "data", "content.json");
let revision = 1;

export function getContentRevision() {
  return revision;
}

function readStored() {
  if (memory.enabled && memory.content) return memory.content;
  return JSON.parse(readFileSync(contentPath, "utf-8"));
}

export function getContent() {
  return mergeContent(readStored());
}

export function getRawContent() {
  return readStored();
}

export async function saveContent(data) {
  revision += 1;
  if (memory.enabled) {
    memory.content = data;
    const { persistContent } = await import("../db/index.js");
    await persistContent(data);
  }
  writeFileSync(contentPath, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
  return mergeContent(data);
}
