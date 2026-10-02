import { enrichService, normalizeServiceOrder } from "./serviceEnrich.js";

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
  const title = `${service.title} | ${siteName} ${location}`;
  const description = `${service.shortDescription || service.title}.${priceBit} Book trained nurses & GDA staff in ${location}. Call for home visits.`.slice(
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
  const title = `${post.title} | Blog | ${siteName}`;
  const description = (post.excerpt || post.title).slice(0, 160);
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
  const title = `${event.title} | ${siteName} ${location}`;
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
    title: `${siteName} | Home Nursing, Elder Care & Injections in ${loc}`,
    description: `Leading home nursing in ${loc} since 2020. GDA staff, registered nurses, wound dressing, IV drip, catheter care, injections at home. Call ${next.contact?.phones?.[0] || ""}.`,
    keywords: kw,
    canonicalPath: "/",
  };

  next.seo.pages.services = {
    ...next.seo.pages.services,
    title: `Nursing Services & Prices | ${siteName} ${loc}`,
    description: `Home health care, elderly care, skilled nursing, injections, IV fluids, wound dressing and catheter services at home in ${loc}. Transparent visit pricing.`,
    keywords: kw,
    canonicalPath: "/services",
  };

  next.seo.pages.blog = {
    title: `Nursing Care Blog | ${siteName}`,
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
