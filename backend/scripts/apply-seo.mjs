import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { applyAutoSeo } from "../../frontend/src/admin/seoAuto.js";

const contentPath = join(dirname(fileURLToPath(import.meta.url)), "../src/data/content.json");
const content = JSON.parse(readFileSync(contentPath, "utf-8"));
writeFileSync(contentPath, `${JSON.stringify(applyAutoSeo(content), null, 2)}\n`, "utf-8");
console.log("SEO + EEAT applied to all pages, services (with sort order), events, and posts.");
