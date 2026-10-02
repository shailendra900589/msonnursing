import { getContent } from "./contentStore.js";

function absUrl(siteUrl, path) {
  const base = (siteUrl || "").replace(/\/$/, "");
  const p = path?.startsWith("/") ? path : `/${path || ""}`;
  return base ? `${base}${p}` : p;
}

function clip(s, max = 200) {
  if (!s) return "";
  const t = String(s).trim();
  return t.length <= max ? t : `${t.slice(0, max - 1).trim()}…`;
}

function resolvePathMeta(content, pathname) {
  const path = pathname.split("?")[0].replace(/\/$/, "") || "/";
  const defaults = content.seo?.default || {};
  const phone = content.contact?.phones?.[0] || "";
  const ctaLabel = defaults.shareCtaLabel || "Book care";
  const ctaAction = defaults.shareCtaAction || "Call now";

  let pageKey = "home";
  let service = null;
  let event = null;
  let post = null;
  let job = null;

  if (path.startsWith("/services/")) {
    const id = path.split("/")[2];
    service = (content.services || []).find((s) => s.id === id);
    pageKey = service ? `service-${service.id}` : "services";
  } else if (path.startsWith("/events/")) {
    const id = path.split("/")[2];
    event = (content.events || []).find((e) => e.id === id);
    pageKey = event ? `event-${event.id}` : "events";
  } else if (path.startsWith("/jobs/")) {
    const id = path.split("/")[2];
    job = (content.jobs || []).find((item) => item.id === id);
    pageKey = job ? `job-${job.id}` : "jobs";
  } else if (path.startsWith("/blog/")) {
    const id = path.split("/")[2];
    post = (content.posts || []).find((p) => p.id === id);
    pageKey = post ? `post-${post.id}` : "blog";
  } else if (path === "/services") pageKey = "services";
  else if (path === "/events") pageKey = "events";
  else if (path === "/blog") pageKey = "blog";
  else if (path === "/jobs") pageKey = "jobs";
  else if (path === "/contact") pageKey = "contact";
  else if (path === "/about") pageKey = "about";
  else if (path === "/") pageKey = "home";

  let meta = content.seo?.pages?.[pageKey] || content.seo?.pages?.[path.slice(1)] || {};
  const item = service || event || post || job;
  if (item?.seo) meta = { ...meta, ...item.seo };

  let canonicalPath = meta.canonicalPath || path;
  if (service) canonicalPath = `/services/${service.id}`;
  if (event) canonicalPath = `/events/${event.id}`;
  if (post) canonicalPath = `/blog/${post.id}`;
  if (job) canonicalPath = `/jobs/${job.id}`;

  const title = meta.title || item?.title || content.site?.name;
  let description = meta.description || item?.excerpt || item?.shortDescription || item?.summary || content.site?.tagline || "";
  const ogImage = meta.ogImage || item?.image || defaults.ogImage || "";
  const canonical = absUrl(content.site?.url, canonicalPath);

  let ogType = "website";
  let twitterLabel1 = ctaAction;
  let twitterData1 = phone;
  if (post) {
    ogType = "article";
    description = clip(`${description} — ${ctaAction}: ${phone}`);
  } else if (service) {
    twitterLabel1 = ctaLabel;
    twitterData1 = service.price ? `${service.price} · ${phone}` : phone;
    description = clip(`${description} — ${ctaLabel}: ${phone}`);
  } else {
    description = clip(`${description} — ${ctaAction}: ${phone}`);
  }

  return {
    title,
    description,
    canonical,
    ogImage: ogImage.startsWith("http") ? ogImage : absUrl(content.site?.url, ogImage),
    ogType,
    twitterLabel1,
    twitterData1,
    siteName: defaults.siteName || content.site?.name,
  };
}

export function buildSocialPreviewHtml(pathname) {
  const content = getContent();
  const meta = resolvePathMeta(content, pathname);
  const esc = (s) =>
    String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>${esc(meta.title)}</title>
<meta name="description" content="${esc(meta.description)}"/>
<link rel="canonical" href="${esc(meta.canonical)}"/>
<meta property="og:type" content="${esc(meta.ogType)}"/>
<meta property="og:site_name" content="${esc(meta.siteName)}"/>
<meta property="og:title" content="${esc(meta.title)}"/>
<meta property="og:description" content="${esc(meta.description)}"/>
<meta property="og:url" content="${esc(meta.canonical)}"/>
${meta.ogImage ? `<meta property="og:image" content="${esc(meta.ogImage)}"/>` : ""}
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${esc(meta.title)}"/>
<meta name="twitter:description" content="${esc(meta.description)}"/>
${meta.ogImage ? `<meta name="twitter:image" content="${esc(meta.ogImage)}"/>` : ""}
${meta.twitterLabel1 ? `<meta name="twitter:label1" content="${esc(meta.twitterLabel1)}"/>` : ""}
${meta.twitterData1 ? `<meta name="twitter:data1" content="${esc(meta.twitterData1)}"/>` : ""}
<meta http-equiv="refresh" content="0;url=${esc(meta.canonical)}"/>
</head>
<body><p><a href="${esc(meta.canonical)}">${esc(meta.title)}</a></p></body>
</html>`;
}

export function buildSocialPreviewJson(pathname) {
  const content = getContent();
  return resolvePathMeta(content, pathname);
}
