import { enrichService, normalizeServiceOrder } from "./serviceEnrich.js";
import { fitTitle } from "../utils/shareMeta.js";

const GLOBAL_KEYWORDS = [
  "home nursing services Lucknow",
  "nursing care at home",
  "nurse at home Lucknow",
  "GDA staff Lucknow",
  "elder care at home",
  "registered nurse at home",
  "injection at home Lucknow",
  "IV drip at home",
  "wound dressing at home",
  "catheter care at home",
  "baby care Lucknow",
  "physiotherapy at home Lucknow",
  "patient care taker Lucknow",
];

function slugWords(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .trim()
    .split(/\s+/)
    .slice(0, 6)
    .join(" ");
}

export function buildServiceSeo(service, siteName, location = "Lucknow") {
  const priceBit = service.price ? ` From ${service.price}.` : "";
  const title = fitTitle(`${service.title} | Home Nursing Lucknow`);
  const description = `Home nursing and elder care in Lucknow from Mson Nursing Services. ${service.shortDescription || service.title}.${priceBit}`.slice(
    0,
    160
  );
  const keywords = [
    slugWords(service.title),
    `${service.title} ${location}`,
    `${service.title} near me`,
    ...GLOBAL_KEYWORDS.slice(0, 8),
  ].join(", ");
  return {
    title,
    description,
    keywords,
    canonicalPath: `/services/${service.id}`,
    ogImage: service.image || "",
    ogImageAlt: service.title,
    aeoSummary: description,
  };
}

export function buildPostSeo(post, siteName, location = "Lucknow") {
  const title = fitTitle(`${post.title} | Home Nursing Lucknow`);
  const description = `Home nursing, home care and elder care in Lucknow from Mson Nursing Services. ${post.excerpt || post.title}`.slice(0, 160);
  const keywords = [post.category, "nursing blog", location, "home healthcare tips", ...GLOBAL_KEYWORDS.slice(0, 5)].join(
    ", "
  );
  return {
    title,
    description,
    keywords,
    canonicalPath: `/blog/${post.id}`,
    ogImage: post.image || "",
    ogImageAlt: post.title,
    tags: post.category || "nursing blog",
    aeoSummary: description,
  };
}

export function buildEventSeo(event, siteName, location = "Lucknow") {
  const title = fitTitle(`${event.title} | Home Nursing Lucknow`);
  const description = (event.shortDescription || event.description || event.title).slice(0, 160);
  const keywords = `health camp ${location}, nursing event, ${event.type}, ${siteName}`;
  return { title, description, keywords, canonicalPath: `/events/${event.id}` };
}

export function applyAutoSeo(content) {
  const next = structuredClone(content);
  const siteName = next.site?.name || "Mson Nursing Services";
  const loc = next.site?.location?.split(",")[0] || "Lucknow";
  const kw = GLOBAL_KEYWORDS.join(", ");

  next.seo = next.seo || { default: {}, pages: {} };
  next.seo.pages = next.seo.pages || {};

  next.seo.pages.home = {
    ...next.seo.pages.home,
    title: "Mson Nursing Services | Home Nursing and Elder Care",
    description:
      "Mson Nursing Services is a nursing agency in Lucknow for home nursing, home care, elder care, nursing care and GDA male attendants.",
    keywords: kw,
    canonicalPath: "/",
  };

  next.seo.pages.services = {
    ...next.seo.pages.services,
    title: "Mson Nursing Services | Home Care Services Lucknow",
    description: `Home health care, elderly care, skilled nursing, injections, IV fluids, wound dressing and catheter services at home in ${loc}. Transparent visit pricing.`,
    keywords: kw,
    canonicalPath: "/services",
  };

  next.seo.pages.blog = {
    title: "Mson Nursing Services | Home Nursing Blog, Lucknow",
    description: `Health tips, elder care guides, and nursing news from ${siteName} in ${loc}.`,
    keywords: `nursing blog, home care tips, elder care ${loc}, ${kw.split(", ").slice(0, 6).join(", ")}`,
    canonicalPath: "/blog",
  };

  next.seo.pages.events = {
    ...next.seo.pages.events,
    keywords: `health camp ${loc}, nursing camp, community healthcare, ${kw.split(", ").slice(0, 5).join(", ")}`,
  };

  next.seo.pages.contact = {
    ...next.seo.pages.contact,
    keywords: `contact nursing ${loc}, home nurse phone, ${kw.split(", ").slice(0, 6).join(", ")}`,
  };

  if (Array.isArray(next.services)) {
    const ctx = {
      siteName,
      city: loc,
      phone: next.contact?.phones?.[0],
      address: next.contact?.address,
    };
    next.services = normalizeServiceOrder(
      next.services.map((s, i) => enrichService({ ...s, sortOrder: s.sortOrder ?? i + 1 }, ctx))
    );
  }

  if (Array.isArray(next.posts)) {
    next.posts = next.posts.map((p) => ({
      ...p,
      seo: {
        ...p.seo,
        ...buildPostSeo(p, siteName, loc),
        ogImageAlt: p.seo?.ogImageAlt || p.imageAlt || p.title,
      },
    }));
  }

  if (Array.isArray(next.events)) {
    next.events = next.events.map((e) => ({
      ...e,
      seo: {
        ...e.seo,
        ...buildEventSeo(e, siteName, loc),
        ogImageAlt: e.seo?.ogImageAlt || e.imageAlt || e.title,
      },
    }));
  }

  return next;
}
