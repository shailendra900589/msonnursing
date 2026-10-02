import { mediaUrl } from "./mediaUrl.js";

function buildUrl(siteUrl, path) {
  const base = (siteUrl || "").replace(/\/$/, "");
  const p = path?.startsWith("/") ? path : `/${path || ""}`;
  return base ? `${base}${p}` : p;
}

function tidyTitle(text) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[|,:–—&-]+\s*$/g, "")
    .trim();
}

/** Keep titles in the 50–60 character band auditors expect. */
export function fitTitle(title) {
  let text = tidyTitle(title);
  if (text.length > 60) {
    const cut = text.slice(0, 60);
    const space = cut.lastIndexOf(" ");
    text = tidyTitle(space >= 50 ? cut.slice(0, space) : cut);
  }
  const pads = [" Lucknow", " | Mson Nursing", " Care"];
  for (const pad of pads) {
    if (text.length >= 50) break;
    if (text.toLowerCase().includes(pad.trim().toLowerCase())) continue;
    if (text.length + pad.length <= 60) text = tidyTitle(text + pad);
  }
  if (text.length < 50) {
    const branded = tidyTitle(`Mson Nursing Services | ${text}`);
    text = branded.length <= 60 ? branded : tidyTitle(branded.slice(0, 60));
  }
  if (text.length > 60) {
    const cut = text.slice(0, 60);
    const space = cut.lastIndexOf(" ");
    text = tidyTitle(space >= 50 ? cut.slice(0, space) : cut);
  }
  return text;
}

function clip(text, max = 200) {
  if (!text) return "";
  const s = String(text).trim();
  if (s.length <= max) return s;
  const cut = s.slice(0, max - 1);
  const space = cut.lastIndexOf(" ");
  const base = (space > Math.floor(max * 0.6) ? cut.slice(0, space) : cut).trim();
  return `${base}…`;
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

const CORE_KEYWORDS =
  "mson nursing services, home nursing, home care, elder care, attendants, nursing agency in lucknow, nursing care, gda male";

const PAGE_COPY = {
  home: {
    title: "Mson Nursing Services | Home Nursing and Elder Care",
    description:
      "Mson Nursing Services is a nursing agency in Lucknow for home nursing, home care, elder care, nursing care and GDA male attendants.",
  },
  services: {
    title: "Mson Nursing Services | Home Care Services Lucknow",
    description:
      "Mson Nursing Services offers home nursing, home care, elder care and nursing care. Nursing agency in Lucknow with GDA male attendants.",
  },
  blog: {
    title: "Mson Nursing Services | Home Nursing Blog, Lucknow",
    description:
      "Home nursing, home care, elder care and nursing care from Mson Nursing Services, a nursing agency in Lucknow with GDA male attendants.",
  },
  about: {
    title: "Mson Nursing Services | About Home Nursing, Lucknow",
    description:
      "About Mson Nursing Services, a nursing agency in Lucknow for home nursing, home care, elder care, nursing care and GDA male attendants.",
  },
  contact: {
    title: "Mson Nursing Services | Contact Home Nursing, Lucknow",
    description:
      "Call Mson Nursing Services, a nursing agency in Lucknow, for home nursing, home care, elder care, nursing care and GDA male attendants.",
  },
  events: {
    title: "Mson Nursing Services | Home Care Events in Lucknow",
    description:
      "Home nursing, home care, elder care and nursing care events by Mson Nursing Services, a nursing agency in Lucknow. GDA male attendants.",
  },
  jobs: {
    title: "Mson Nursing Services | Nursing Careers in Lucknow",
    description:
      "Mson Nursing Services, a nursing agency in Lucknow, hires for home nursing, home care, elder care, nursing care and GDA male attendants.",
  },
};

function leadKeywords(description) {
  const text = String(description || "").replace(/\s+/g, " ").trim();
  const lower = text.toLowerCase();
  const phrases = [
    "mson nursing services",
    "home nursing",
    "home care",
    "elder care",
    "nursing care",
    "nursing agency in lucknow",
    "gda male",
    "attendants",
  ];
  if (phrases.every((phrase) => lower.includes(phrase))) return text;
  const lead =
    "Mson Nursing Services offers home nursing, home care, elder care and nursing care. Nursing agency in Lucknow with GDA male attendants.";
  return `${lead} ${text}`.replace(/\s+/g, " ").trim();
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
  const pageCopy = !item && PAGE_COPY[pageKey] ? PAGE_COPY[pageKey] : null;
  let title = pageCopy?.title || meta.title || item?.title || siteName;
  let description =
    pageCopy?.description ||
    meta.description ||
    item?.excerpt ||
    item?.shortDescription ||
    item?.summary ||
    content.site?.tagline ||
    "";
  const keywords = [meta.keywords, CORE_KEYWORDS].filter(Boolean).join(", ");
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
    title = meta.title || `${post.title} | Home Nursing Lucknow`;
    description = withCta(leadKeywords(meta.description || post.excerpt || post.title), navCta, phone);
  } else if (service) {
    ogType = "website";
    twitterLabel1 = ctaLabel;
    twitterData1 = service.price ? `${service.price} · ${phone}` : phone;
    twitterLabel2 = "Service";
    twitterData2 = clip(service.title, 60);
    const priceBit = service.price ? ` From ${service.price}.` : "";
    title = meta.title || `${service.title} | Home Nursing Lucknow`;
    description = withCta(
      leadKeywords(meta.description || `${service.shortDescription || service.title}.${priceBit}`),
      ctaLabel,
      phone
    );
  } else if (job) {
    title = meta.title || `${job.title} | Nursing Careers Lucknow`;
    description = withCta(leadKeywords(meta.description || job.summary || job.description || ""), "Apply", phone);
    twitterLabel1 = "Location";
    twitterData1 = job.addressLocality || "Lucknow";
    twitterLabel2 = "Role";
    twitterData2 = clip(job.title, 60);
  } else if (event) {
    twitterLabel1 = "Register";
    twitterData1 = phone;
    twitterLabel2 = "When";
    twitterData2 = clip(`${event.date || ""} ${event.location || ""}`.trim(), 60);
    title = meta.title || `${event.title} | Home Nursing Lucknow`;
    description = withCta(leadKeywords(description), "Register", phone);
  } else {
    description = withCta(description, ctaAction, phone);
    twitterLabel2 = siteName;
    twitterData2 = clip(content.site?.location || "Lucknow", 40);
  }

  const shareTitle = meta.shareTitle || title;
  const shareText = meta.shareText || description;

  return {
    title: fitTitle(title),
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
