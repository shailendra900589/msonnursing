import { mediaUrl } from "./mediaUrl.js";

function buildUrl(siteUrl, path) {
  const base = (siteUrl || "").replace(/\/$/, "");
  const p = path?.startsWith("/") ? path : `/${path || ""}`;
  return base ? `${base}${p}` : p;
}

function clip(text, max = 200) {
  if (!text) return "";
  const s = String(text).trim();
  return s.length <= max ? s : `${s.slice(0, max - 1).trim()}…`;
}

function appendCta(description, ctaLabel, ctaValue, max = 160) {
  if (!ctaLabel || !ctaValue) return clip(description, max);
  const suffix = ` — ${ctaLabel}: ${ctaValue}`;
  const room = max - suffix.length;
  if (room < 40) return clip(description, max);
  return clip(description, room) + suffix;
}

function withCta(description, label, value, max = 160) {
  const text = String(description || "").trim();
  if (value && text.includes(String(value))) return clip(text, max);
  return appendCta(text, label, value, max);
}

/** Unified meta for <head> tags and native Web Share API. */
export function resolveShareMeta({ content, pageKey, service, event, post, job }) {
  if (!content) return null;

  const defaults = content.seo?.default || {};
  const contact = content.contact || {};
  const phone = contact.phones?.[0] || "";
  const siteName = content.site?.name || "Mson Nursing Services";
  const siteUrl = content.site?.url || "";
  const ctaLabel = defaults.shareCtaLabel || "Book care";
  const ctaAction = defaults.shareCtaAction || "Call now";
  const navCta = content.header?.navCtaLabel || "Get in Touch";

  let meta = content.seo?.pages?.[pageKey] || {};
  const item = service || event || post || job;
  if (item?.seo) meta = { ...meta, ...item.seo };

  let canonicalPath = meta.canonicalPath || "/";
  if (service) canonicalPath = `/services/${service.id}`;
  if (event) canonicalPath = `/events/${event.id}`;
  if (post) canonicalPath = `/blog/${post.id}`;
  if (job) canonicalPath = `/jobs/${job.id}`;

  const canonical = buildUrl(siteUrl, canonicalPath);
  let title = meta.title || item?.title || siteName;
  let description = meta.description || item?.excerpt || item?.shortDescription || item?.summary || content.site?.tagline || "";
  const keywords = meta.keywords || "";
  const rawImage = mediaUrl(meta.ogImage || item?.image || item?.heroImage || defaults.ogImage);
  const ogImage = rawImage ? (/^https?:\/\//i.test(rawImage) ? rawImage : buildUrl(siteUrl, rawImage)) : "";
  const ogImageAlt = meta.ogImageAlt || item?.imageAlt || item?.heroImageAlt || item?.title || title;

  let ogType = "website";
  let twitterLabel1 = ctaAction;
  let twitterData1 = phone;
  let twitterLabel2 = "";
  let twitterData2 = "";

  if (post) {
    ogType = "article";
    twitterLabel1 = "Read article";
    twitterData2 = post.category || "Blog";
    twitterLabel2 = "Topic";
    description = withCta(description, navCta, phone);
  } else if (service) {
    ogType = "website";
    twitterLabel1 = ctaLabel;
    twitterData1 = service.price ? `${service.price} · ${phone}` : phone;
    twitterLabel2 = "Service";
    twitterData2 = clip(service.title, 60);
    const priceBit = service.price ? ` From ${service.price}.` : "";
    description = withCta(
      meta.description || `${service.shortDescription || service.title}.${priceBit}`,
      ctaLabel,
      phone
    );
  } else if (job) {
    if (!meta.title) title = `${job.title} | Careers | ${siteName}`;
    description = withCta(meta.description || job.summary || job.description || "", "Apply", phone);
    twitterLabel1 = "Location";
    twitterData1 = job.addressLocality || "Lucknow";
    twitterLabel2 = "Role";
    twitterData2 = clip(job.title, 60);
  } else if (event) {
    twitterLabel1 = "Register";
    twitterData1 = phone;
    twitterLabel2 = "When";
    twitterData2 = clip(`${event.date || ""} ${event.location || ""}`.trim(), 60);
    description = withCta(description, "Register", phone);
  } else {
    description = withCta(description, ctaAction, phone);
    twitterLabel2 = siteName;
    twitterData2 = clip(content.site?.location || "Lucknow", 40);
  }

  const shareTitle = meta.shareTitle || title;
  const shareText = meta.shareText || description;

  return {
    title,
    description: clip(description, 160),
    keywords,
    canonical,
    canonicalPath,
    ogImage,
    ogImageAlt,
    ogType,
    locale: defaults.locale || "en_IN",
    twitterCard: defaults.twitterCard || "summary_large_image",
    twitterSite: defaults.twitterSite || "",
    twitterLabel1,
    twitterData1,
    twitterLabel2,
    twitterData2,
    shareTitle,
    shareText,
    phone,
    ctaLabel,
    article: post
      ? {
          publishedTime: post.date,
          author: post.author || siteName,
          section: post.category,
          tags: (meta.tags || post.category || "").split(",").map((t) => t.trim()).filter(Boolean),
        }
      : null,
  };
}
