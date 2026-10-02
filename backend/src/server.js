import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { copyFileSync, existsSync } from "fs";
import apiRoutes from "./routes/api.js";
import adminRoutes from "./routes/admin.js";
import uploadRoutes from "./routes/upload.js";
import { ensureUploadDirs, UPLOAD_ROOT } from "./config/uploads.js";
import { ensureResumeDir } from "./utils/resumeFiles.js";
import { initDatabase } from "./db/index.js";
import { memory } from "./db/memory.js";

ensureUploadDirs();
ensureResumeDir();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedLogo = path.join(__dirname, "..", "..", "frontend", "public", "logo.png");
const seededLogo = path.join(UPLOAD_ROOT, "logos", "logo.png");
if (existsSync(seedLogo) && !existsSync(seededLogo)) {
  copyFileSync(seedLogo, seededLogo);
}

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const frontendDist = path.join(__dirname, "..", "..", "frontend", "dist");
const serveFrontend = process.env.NODE_ENV === "production" && existsSync(path.join(frontendDist, "index.html"));

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "2mb" }));

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

if (serveFrontend) {
  app.use(express.static(frontendDist));
  app.get(/^(?!\/api|\/uploads).*/, (req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    res.sendFile(path.join(frontendDist, "index.html"));
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

try {
  await initDatabase();
} catch (error) {
  console.error("MySQL connection failed:", error.message);
  if (process.env.NODE_ENV === "production") process.exit(1);
  console.error("Continuing with JSON files so the site can still be tested.");
}

const server = app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
  if (serveFrontend) console.log(`Website running at http://localhost:${PORT}`);
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
