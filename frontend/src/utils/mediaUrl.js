const API_BASE = import.meta.env.VITE_API_URL || "";

/** Resolve CMS image paths (backend /uploads) and external URLs */
export function mediaUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${normalized}`;
}

/** Ask Pexels for a smaller file when the CMS URL is a full-size photo. */
export function imageSrc(path, width) {
  const src = mediaUrl(path);
  if (!src || !width || !/images\.pexels\.com/i.test(src)) return src;
  if (/[?&]w=\d+/.test(src)) return src.replace(/([?&]w=)\d+/, `$1${width}`);
  const joiner = src.includes("?") ? "&" : "?";
  return `${src}${joiner}auto=compress&cs=tinysrgb&w=${width}`;
}
