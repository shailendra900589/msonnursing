const API_BASE = import.meta.env.VITE_API_URL || "";

/** Resolve CMS image paths (backend /uploads) and external URLs */
export function mediaUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${normalized}`;
}
