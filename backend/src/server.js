import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { copyFileSync, existsSync, readFileSync } from "fs";
import apiRoutes from "./routes/api.js";
import adminRoutes from "./routes/admin.js";
import uploadRoutes from "./routes/upload.js";
import { ensureUploadDirs, UPLOAD_ROOT } from "./config/uploads.js";
import { ensureResumeDir } from "./utils/resumeFiles.js";
import { initDatabase } from "./db/index.js";
import { memory } from "./db/memory.js";
import { getContent, getContentRevision } from "./utils/contentStore.js";
import { buildSitemapXml } from "./utils/sitemap.js";

ensureUploadDirs();
ensureResumeDir();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedLogo = path.join(__dirname, "..", "..", "frontend", "public", "logo.png");
const seededLogo = path.join(UPLOAD_ROOT, "logos", "logo.png");
if (existsSync(seedLogo) && !existsSync(seededLogo)) {
  copyFileSync(seedLogo, seededLogo);
}

const app = express();
app.disable("x-powered-by");
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const frontendDist = path.join(__dirname, "..", "..", "frontend", "dist");
const serveFrontend = existsSync(path.join(frontendDist, "index.html"));

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(canonicalRedirect);

app.use("/uploads", express.static(UPLOAD_ROOT));

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "Mson Nursing Services API",
    database: memory.enabled ? "mysql" : "json",
  });
});

app.use("/api", apiRoutes);
app.use("/api/admin/upload", uploadRoutes);
app.use("/api/admin", adminRoutes);

const shellFile = path.join(frontendDist, "shell.html");
const ssrEntry = path.join(frontendDist, "ssr", "entry-server.js");
let renderPage = null;
const pageCache = new Map();
let cacheRevision = 0;

function isAssetPath(pathname) {
  const last = String(pathname || "").split("/").filter(Boolean).pop() || "";
  return last.includes(".");
}

function isPublicPage(req) {
  if (req.method !== "GET" && req.method !== "HEAD") return false;
  const pathname = req.path || "/";
  if (pathname.startsWith("/api") || pathname.startsWith("/uploads")) return false;
  if (pathname.startsWith("/admin") || pathname.startsWith("/preview")) return false;
  if (pathname.includes("..")) return false;
  return !isAssetPath(pathname);
}

function requestHost(req) {
  return String(req.headers["x-forwarded-host"] || req.headers.host || "")
    .split(",")[0]
    .trim()
    .replace(/:\d+$/, "")
    .toLowerCase();
}

function requestOrigin(req) {
  const host = requestHost(req);
  if (!host) return "";
  const forwarded = String(req.headers["x-forwarded-proto"] || "").split(",")[0].trim();
  const proto = forwarded || (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

function canonicalRedirect(req, res, next) {
  if (req.method !== "GET" && req.method !== "HEAD") return next();
  const hostname = requestHost(req);
  if (!hostname || hostname === "localhost" || hostname === "127.0.0.1") return next();
  const forwarded = String(req.headers["x-forwarded-proto"] || "").split(",")[0].trim().toLowerCase();
  const url = new URL(req.originalUrl || "/", "https://placeholder.local");
  const trimmed = url.pathname.length > 1 ? url.pathname.replace(/\/+$/, "") : url.pathname;
  const dropWww = hostname.startsWith("www.");
  const dropSlash = trimmed !== url.pathname;
  const upgradeHttps = forwarded === "http";
  if (!dropWww && !dropSlash && !upgradeHttps) return next();
  const bare = hostname.replace(/^www\./, "");
  res.redirect(301, `https://${bare}${trimmed}${url.search}`);
}

const STATIC_PAGES = new Set(["/", "/about", "/services", "/events", "/contact", "/blog", "/jobs", "/enquiry/thanks"]);

function isKnownPublicPath(pathname, content) {
  const pathName = String(pathname || "/").replace(/\/+$/, "") || "/";
  if (STATIC_PAGES.has(pathName)) return true;
  const match = pathName.match(/^\/(services|events|blog|jobs)\/([^/]+)$/);
  if (!match) return false;
  const id = decodeURIComponent(match[2]);
  const lists = {
    services: content?.services,
    events: content?.events,
    blog: content?.posts,
    jobs: content?.jobs,
  };
  return (lists[match[1]] || []).some((item) => item?.id === id);
}

function liveHtml(pathname, origin) {
  if (!renderPage || !existsSync(shellFile)) return null;
  const revision = getContentRevision();
  if (revision !== cacheRevision) {
    pageCache.clear();
    cacheRevision = revision;
  }
  const key = `${origin || ""}|${pathname || "/"}`;
  if (pageCache.has(key)) return pageCache.get(key);
  const content = getContent();
  const rendered = renderPage(pathname || "/", content, origin);
  const html = readFileSync(shellFile, "utf8")
    .replace("<!--ssr-css-->", "")
    .replace("<!--ssr-head-->", rendered.head)
    .replace("<!--ssr-html-->", rendered.html)
    .replace("<!--ssr-data-->", `<script src="/ssr-data.js"></script>`)
    .replace(/(?<![\d+])(?<!91 )(9807925369|8894654090)(?!\d)/g, "+91 $1");
  if (pageCache.size > 300) pageCache.clear();
  pageCache.set(key, html);
  return html;
}

function pageFile(requestPath) {
  const pathname = decodeURIComponent(String(requestPath || "/").split("?")[0]);
  if (pathname.includes("..") || pathname.includes("\0")) {
    return path.join(frontendDist, "index.html");
  }
  const clean = pathname === "/" ? "" : pathname.replace(/^\/+|\/+$/g, "");
  const nested = clean ? path.resolve(frontendDist, clean, "index.html") : path.join(frontendDist, "index.html");
  const root = path.resolve(frontendDist);
  if (!nested.startsWith(root) || !existsSync(nested)) {
    return path.join(frontendDist, "index.html");
  }
  return nested;
}

function robotsTxt(origin) {
  const base = (origin || "https://msonnursing.com").replace(/\/$/, "");
  return [
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin",
    "Disallow: /preview",
    "Disallow: /enquiry/thanks",
    "",
    "User-agent: Googlebot",
    "Allow: /",
    "Disallow: /admin",
    "Disallow: /preview",
    "Disallow: /enquiry/thanks",
    "",
    `Sitemap: ${base}/sitemap.xml`,
    "",
  ].join("\n");
}

app.get("/sitemap.xml", (req, res) => {
  const origin = requestOrigin(req) || process.env.SITE_URL || "https://msonnursing.com";
  res.type("application/xml");
  res.setHeader("Cache-Control", "no-cache");
  res.send(buildSitemapXml(origin));
});

app.get("/robots.txt", (req, res) => {
  const origin = requestOrigin(req) || process.env.SITE_URL || "https://msonnursing.com";
  res.type("text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");
  res.send(robotsTxt(origin));
});

if (serveFrontend) {
  app.get("/ssr-data.js", (_req, res) => {
    const data = JSON.stringify(getContent()).replace(/</g, "\\u003c");
    res.setHeader("Content-Type", "text/javascript; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.send(`window.__SSR_DATA__=${data};`);
  });
  app.get(/^(?!\/api|\/uploads).*/, (req, res, next) => {
    if (!isPublicPage(req)) return next();
    try {
      const pathname = req.path || "/";
      const html = liveHtml(pathname, requestOrigin(req));
      if (!html) return next();
      res.status(isKnownPublicPath(pathname, getContent()) ? 200 : 404);
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "no-cache");
      if (req.method === "HEAD") return res.end();
      return res.send(html);
    } catch (error) {
      console.error("Page render failed:", error.message);
      return next();
    }
  });
  app.use(express.static(frontendDist, { index: false }));
  app.get(/^(?!\/api|\/uploads).*/, (req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    const file = req.path.startsWith("/admin") || req.path.startsWith("/preview")
      ? (existsSync(shellFile) ? shellFile : path.join(frontendDist, "index.html"))
      : pageFile(req.path);
    if (!req.path.startsWith("/admin") && !req.path.startsWith("/preview") && !isKnownPublicPath(req.path, getContent())) {
      res.status(404);
    }
    res.sendFile(file);
  });
} else {
  app.get("/", (_req, res) => {
    res.json({
      service: "Mson Nursing Services API",
      message: "This port is the backend only. Open the website and admin in your browser:",
      website: CLIENT_ORIGIN,
      admin: `${CLIENT_ORIGIN}/admin/login`,
      health: "/api/health",
      database: memory.enabled ? "mysql" : "json",
    });
  });
}

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

async function start() {
  try {
    await initDatabase();
  } catch (error) {
    console.error("MySQL connection failed:", error.message);
    console.error("Continuing with JSON files so the site stays online.");
  }

  if (existsSync(ssrEntry) && existsSync(shellFile)) {
    try {
      const mod = await import(pathToFileURL(ssrEntry).href);
      renderPage = mod.render;
      console.log("Live pages render from the current content, including new posts.");
    } catch (error) {
      console.error("Live page renderer failed to load:", error.message);
    }
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`API running at http://0.0.0.0:${PORT}`);
    if (serveFrontend) console.log(`Website running at http://0.0.0.0:${PORT}`);
    else console.error("frontend/dist is missing. Run npm run build before starting in production.");
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(
        `Port ${PORT} is already in use. Stop the other process or run: npx kill-port ${PORT}`
      );
      process.exit(1);
    }
    throw err;
  });
}

start();
