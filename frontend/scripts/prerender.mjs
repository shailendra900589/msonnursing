import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { build } from "vite";

const frontendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(frontendRoot, "dist");
const ssrDir = path.join(frontendRoot, ".ssr-build");
const templatePath = path.join(distDir, "index.html");
const contentPath = path.join(frontendRoot, "public", "content-fallback.json");

function routesFrom(content) {
  const routes = new Set(["/", "/about", "/services", "/events", "/contact", "/blog", "/jobs"]);
  const add = (prefix, list) => {
    for (const item of Array.isArray(list) ? list : []) {
      const id = item?.id || item?.slug;
      if (id) routes.add(`${prefix}/${id}`);
    }
  };
  add("/services", content.services);
  add("/blog", content.posts);
  add("/events", content.events);
  add("/jobs", content.jobs);
  return [...routes];
}

function pagePath(route) {
  if (route === "/") return path.join(distDir, "index.html");
  return path.join(distDir, route.replace(/^\//, ""), "index.html");
}

await build({
  root: frontendRoot,
  configFile: path.join(frontendRoot, "vite.config.js"),
  logLevel: "warn",
  build: {
    ssr: "src/entry-server.jsx",
    outDir: ssrDir,
    emptyOutDir: true,
  },
});

const { render } = await import(pathToFileURL(path.join(ssrDir, "entry-server.js")).href);
const content = JSON.parse(fs.readFileSync(contentPath, "utf8"));
const template = fs.readFileSync(templatePath, "utf8");
const data = JSON.stringify(content).replace(/</g, "\\u003c");
fs.writeFileSync(path.join(distDir, "ssr-data.js"), `window.__SSR_DATA__=${data};\n`);

let count = 0;
for (const route of routesFrom(content)) {
  const rendered = render(route, content);
  const html = template
    .replace("<!--ssr-css-->", "")
    .replace("<!--ssr-head-->", rendered.head)
    .replace("<!--ssr-html-->", rendered.html)
    .replace("<!--ssr-data-->", `<script src="/ssr-data.js"></script>`);
  const file = pagePath(route);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  count += 1;
}

fs.rmSync(ssrDir, { recursive: true, force: true });
console.log(`[prerender] Wrote ${count} pages`);
