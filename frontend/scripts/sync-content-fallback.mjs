import { copyFileSync, existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { buildLlmsTxt } from "../../backend/src/utils/llmsTxt.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.resolve(root, "..", "backend", "src", "data", "content.json");
const dest = path.join(root, "public", "content-fallback.json");
const llmsDest = path.join(root, "public", "llms.txt");

if (!existsSync(src)) {
  console.warn("[sync-content-fallback] Missing backend content.json — skip");
  process.exit(0);
}

copyFileSync(src, dest);
const content = JSON.parse(readFileSync(src, "utf8").replace(/^\uFEFF/, ""));
writeFileSync(llmsDest, buildLlmsTxt(content));
console.log("[sync-content-fallback] Updated public/content-fallback.json and public/llms.txt");
