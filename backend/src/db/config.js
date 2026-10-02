import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
dotenv.config({ path: path.join(backendRoot, ".env") });

export function mysqlConfig() {
  const host = String(process.env.MYSQL_HOST || "").trim();
  const database = String(process.env.MYSQL_DATABASE || "").trim();
  const user = String(process.env.MYSQL_USER || "").trim();
  if (!host || !database || !user) return null;
  return {
    host,
    port: Number(process.env.MYSQL_PORT || 3306),
    user,
    password: process.env.MYSQL_PASSWORD || "",
    database,
    charset: "utf8mb4",
    connectTimeout: 10000,
  };
}

export function mysqlEnabled() {
  return Boolean(mysqlConfig());
}
