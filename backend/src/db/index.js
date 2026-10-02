import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";
import { mysqlConfig, mysqlEnabled } from "./config.js";
import { memory } from "./memory.js";

const contentPath = join(dirname(fileURLToPath(import.meta.url)), "..", "data", "content.json");
const enquiryPath = join(dirname(fileURLToPath(import.meta.url)), "..", "data", "enquiries.json");

let pool = null;

export function getPool() {
  return pool;
}

async function ensureTables(db) {
  await db.query(`
    CREATE TABLE IF NOT EXISTS site_content (
      id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
      data LONGTEXT NOT NULL,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS enquiries (
      id VARCHAR(64) NOT NULL PRIMARY KEY,
      created_at DATETIME NOT NULL,
      payload LONGTEXT NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS app_settings (
      setting_key VARCHAR(64) NOT NULL PRIMARY KEY,
      setting_value TEXT NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

function readJsonFile(filePath, fallback) {
  try {
    return JSON.parse(readFileSync(filePath, "utf-8").replace(/^\uFEFF/, ""));
  } catch {
    return fallback;
  }
}

export async function initDatabase() {
  const config = mysqlConfig();
  if (!config) {
    console.log("Database: JSON files. Add MYSQL_HOST, MYSQL_USER, and MYSQL_DATABASE to use MySQL.");
    return { mode: "json" };
  }

  pool = mysql.createPool({
    ...config,
    waitForConnections: true,
    connectionLimit: 8,
  });

  await ensureTables(pool);

  const [contentRows] = await pool.query("SELECT data FROM site_content WHERE id = 1");
  if (!contentRows.length) {
    const seed = readFileSync(contentPath, "utf-8");
    await pool.query("INSERT INTO site_content (id, data) VALUES (1, ?)", [seed]);
    memory.content = JSON.parse(seed);
    console.log("Database: seeded site content from content.json");
  } else {
    memory.content = JSON.parse(contentRows[0].data);
  }

  const [enquiryRows] = await pool.query("SELECT payload FROM enquiries ORDER BY created_at DESC");
  if (!enquiryRows.length) {
    const existing = readJsonFile(enquiryPath, []);
    for (const row of existing) {
      if (!row?.id) continue;
      await pool.query("INSERT IGNORE INTO enquiries (id, created_at, payload) VALUES (?, ?, ?)", [
        row.id,
        new Date(row.createdAt || Date.now()),
        JSON.stringify(row),
      ]);
    }
    memory.enquiries = existing;
  } else {
    memory.enquiries = enquiryRows.map((row) => JSON.parse(row.payload));
  }

  const [settings] = await pool.query(
    "SELECT setting_value FROM app_settings WHERE setting_key = 'admin_password_hash'"
  );
  memory.adminHash = settings[0]?.setting_value || "";
  memory.enabled = true;
  console.log(`Database: MySQL ${config.database} @ ${config.host}`);
  return { mode: "mysql" };
}

export async function persistContent(data) {
  if (!pool) return;
  const json = JSON.stringify(data);
  await pool.query(
    "INSERT INTO site_content (id, data) VALUES (1, ?) ON DUPLICATE KEY UPDATE data = ?",
    [json, json]
  );
}

export async function persistEnquiry(row) {
  if (!pool) return;
  await pool.query("INSERT INTO enquiries (id, created_at, payload) VALUES (?, ?, ?)", [
    row.id,
    new Date(row.createdAt || Date.now()),
    JSON.stringify(row),
  ]);
}

export async function persistAdminHash(hash) {
  if (!pool) return;
  memory.adminHash = hash;
  await pool.query(
    "INSERT INTO app_settings (setting_key, setting_value) VALUES ('admin_password_hash', ?) ON DUPLICATE KEY UPDATE setting_value = ?",
    [hash, hash]
  );
}

export { mysqlEnabled };
