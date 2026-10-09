const PUBLIC_ORIGIN = "https://www.msonnursing.com";

/** Keep every public canonical on https://www.msonnursing.com. Localhost stays local. */
export function canonicalSiteUrl(siteUrl, pageOrigin) {
  const raw = String(pageOrigin || siteUrl || PUBLIC_ORIGIN).trim();
  try {
    const url = new URL(raw.includes("://") ? raw : `https://${raw}`);
    const host = url.hostname.replace(/^www\./i, "");
    if (host === "localhost" || host === "127.0.0.1") return url.origin;
    if (host === "msonnursing.com") return PUBLIC_ORIGIN;
    return url.origin;
  } catch {
    return PUBLIC_ORIGIN;
  }
}

export function withPublicSiteUrl(content, pageOrigin) {
  if (!content?.site) return content;
  const url = canonicalSiteUrl(content.site.url, pageOrigin);
  if (content.site.url === url) return content;
  return { ...content, site: { ...content.site, url } };
}
