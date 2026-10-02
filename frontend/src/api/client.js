const API_BASE = import.meta.env.VITE_API_URL || "";

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** Where the last successful fetchContent() loaded data from. */
let lastContentSource = "api";
export function getLastContentSource() {
  return lastContentSource;
}

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, { ...options });
  } catch (err) {
    if (err?.name === "AbortError") throw err;
    throw new ApiError("Cannot reach API. Start backend on port 5000.", 0);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      res.status >= 502 && res.status <= 504
        ? "Cannot reach API. Start backend on port 5000."
        : data.error || "Request failed";
    throw new ApiError(msg, res.status);
  }
  return data;
}

function isValidContent(data) {
  return Boolean(data && data.site && Array.isArray(data.services));
}

async function loadPublicFallback() {
  const res = await fetch("/content-fallback.json", { cache: "no-store" });
  if (!res.ok) throw new ApiError("Fallback content missing", res.status);
  const data = await res.json();
  if (!isValidContent(data)) throw new ApiError("Invalid fallback content", res.status);
  return data;
}

async function loadBundledFallback() {
  if (!import.meta.env.DEV) throw new ApiError("Bundled snapshot unavailable", 0);
  const mod = await import("../dev/contentSnapshot.js");
  const data = mod.default ?? mod;
  if (!isValidContent(data)) throw new ApiError("Invalid bundled content snapshot", 0);
  return data;
}

const API_TIMEOUT_MS = import.meta.env.DEV ? 8000 : 0;

async function requestContentFromApi() {
  if (!API_TIMEOUT_MS) return request("/api/content");

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  try {
    return await request("/api/content", { signal: controller.signal });
  } catch (err) {
    if (err.name === "AbortError") {
      throw new ApiError("Cannot reach API. Start backend on port 5000.", 0);
    }
    throw err;
  } finally {
    window.clearTimeout(timer);
  }
}

export async function fetchContent() {
  const attempts = [
    { source: "api", load: () => requestContentFromApi() },
    { source: "fallback", load: loadPublicFallback },
  ];
  if (import.meta.env.DEV) {
    attempts.push({ source: "fallback", load: loadBundledFallback });
  }

  let lastError = null;

  for (const { source, load } of attempts) {
    try {
      const data = await load();
      if (!isValidContent(data)) continue;
      lastContentSource = source;
      if (source === "fallback") {
        console.warn(
          import.meta.env.DEV
            ? "[Mson dev] Live API unavailable — using offline content snapshot. Start backend: npm run dev (project root)"
            : "[Mson] API unavailable — using bundled content snapshot."
        );
      }
      return data;
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError instanceof ApiError
    ? lastError
    : new ApiError("Cannot load website content. Start backend on port 5000.", 0);
}

export function submitEnquiry(payload, resumeFile) {
  if (resumeFile) {
    const form = new FormData();
    Object.entries(payload || {}).forEach(([key, value]) => {
      if (value == null || value === "") return;
      form.append(key, typeof value === "object" ? JSON.stringify(value) : String(value));
    });
    form.append("resume", resumeFile);
    return request("/api/enquiries", { method: "POST", body: form });
  }
  return request("/api/enquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function adminFetchResumeBlob(token, id, download = false) {
  const query = download ? "?download=1" : "";
  let res;
  try {
    res = await fetch(`${API_BASE}/api/admin/enquiries/${encodeURIComponent(id)}/resume${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    throw new ApiError("Cannot reach API. Start backend on port 5000.", 0);
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new ApiError(data.error || "Could not open resume", res.status);
  }
  return res.blob();
}

export function saveResumeFile(blob, filename = "resume") {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || "resume";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function adminFetchEnquiries(token) {
  return request("/api/admin/enquiries", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function adminUpdatePassword(token, currentPassword, newPassword) {
  return request("/api/admin/password", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export function adminLogin(password) {
  return request("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
}

export function adminFetchContent(token) {
  return request("/api/admin/content", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function adminSaveContent(token, content) {
  return request("/api/admin/content", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(content),
  });
}

export const AUTH_KEY = "mson_admin_token";

export async function adminUploadFile(token, file, folder = "images") {
  const form = new FormData();
  form.append("folder", folder);
  form.append("file", file);
  const res = await fetch(`${API_BASE}/api/admin/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data;
}

export function adminListMedia(token) {
  return request("/api/admin/upload/media", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function adminDeleteMedia(token, folder, filename) {
  return request(`/api/admin/upload/media/${encodeURIComponent(folder)}/${encodeURIComponent(filename)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}
