const ALLOWED_HOSTS = ["google.com", "google.co.in", "openstreetmap.org"];

function isAllowedMapUrl(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return "";
    const host = url.hostname.replace(/^www\./, "");
    const allowed = ALLOWED_HOSTS.some((item) => host === item || host.endsWith(`.${item}`));
    return allowed ? url.toString() : "";
  } catch {
    return "";
  }
}

/** Accept a maps URL or an iframe embed snippet from the CMS. */
export function mapEmbedSrc(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const src = raw.match(/\ssrc\s*=\s*["']([^"']+)["']/i)?.[1] || raw;
  return isAllowedMapUrl(src);
}
