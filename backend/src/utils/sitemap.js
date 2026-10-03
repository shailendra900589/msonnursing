import { getContent } from "./contentStore.js";

function xmlEscape(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function day(value) {
  const text = String(value || "").slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : "";
}

function imageBlock(image, title) {
  if (!image || !/^https?:\/\//i.test(image)) return "";
  const caption = title ? `<image:title>${xmlEscape(title)}</image:title>` : "";
  return `<image:image><image:loc>${xmlEscape(image)}</image:loc>${caption}</image:image>`;
}

export function buildSitemapXml(baseUrl) {
  const base = (baseUrl || "https://www.msonnursing.com").replace(/\/$/, "");
  const content = getContent();
  const hero = content.pages?.home?.heroImage;
  const heroAlt = content.pages?.home?.heroImageAlt || content.site?.name;
  const urls = [
    { loc: `${base}/`, priority: "1.0", image: hero, imageTitle: heroAlt },
    { loc: `${base}/about`, priority: "0.8", image: content.pages?.about?.image, imageTitle: content.pages?.about?.imageAlt },
    { loc: `${base}/services`, priority: "0.9" },
    { loc: `${base}/events`, priority: "0.7" },
    { loc: `${base}/blog`, priority: "0.75" },
    { loc: `${base}/contact`, priority: "0.85" },
    { loc: `${base}/jobs`, priority: "0.8" },
  ];

  const services = [...(content.services || [])].sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
  for (const s of services) {
    urls.push({
      loc: `${base}/services/${s.id}`,
      priority: s.seo?.sitemapPriority || "0.85",
      image: s.image,
      imageTitle: s.imageAlt || s.title,
    });
  }
  for (const e of content.events || []) {
    if (e.published === false) continue;
    urls.push({
      loc: `${base}/events/${e.id}`,
      priority: "0.6",
      lastmod: day(e.date),
      image: e.image,
      imageTitle: e.imageAlt || e.title,
    });
  }
  for (const job of content.jobs || []) {
    if (job.published === false) continue;
    urls.push({ loc: `${base}/jobs/${job.id}`, priority: "0.7", lastmod: day(job.datePosted) });
  }
  for (const p of content.posts || []) {
    if (p.published === false) continue;
    urls.push({
      loc: `${base}/blog/${p.id}`,
      priority: "0.65",
      lastmod: day(p.date),
      image: p.image,
      imageTitle: p.imageAlt || p.title,
    });
  }

  const body = urls
    .map((u) => {
      const last = u.lastmod ? `<lastmod>${xmlEscape(u.lastmod)}</lastmod>` : "";
      const image = imageBlock(u.image, u.imageTitle);
      return `  <url><loc>${xmlEscape(u.loc)}</loc>${last}<changefreq>weekly</changefreq><priority>${u.priority}</priority>${image}</url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${body}
</urlset>`;
}
