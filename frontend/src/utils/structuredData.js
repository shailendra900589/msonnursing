import { buildJobPosting } from "./jobPosting.js";
import { socialProfiles } from "./socialLinks.js";

function abs(siteUrl, path) {
  const base = String(siteUrl || "").replace(/\/$/, "");
  if (!path) return base;
  if (/^https?:\/\//i.test(path)) return path;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${clean}` : clean;
}

export function businessGeo(content) {
  const embed = content?.footer?.mapEmbed || "";
  const match = embed.match(/!2d(-?\d+(?:\.\d+)?)!3d(-?\d+(?:\.\d+)?)/);
  if (!match) return null;
  return { latitude: match[2], longitude: match[1] };
}

function openingHours(hours) {
  const match = String(hours || "").match(
    /(\d{1,2})(?::(\d{2}))?\s*(AM|PM)\s*[–-]\s*(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i
  );
  if (!match || !/mon/i.test(hours) || !/sun/i.test(hours)) return null;
  const to24 = (hour, minute, ap) => {
    let value = Number(hour) % 12;
    if (String(ap).toUpperCase() === "PM") value += 12;
    return `${String(value).padStart(2, "0")}:${minute || "00"}`;
  };
  return {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: to24(match[1], match[2], match[3]),
    closes: to24(match[4], match[5], match[6]),
  };
}

function postalAddress(content) {
  const address = content.contact?.address || "";
  const postal = address.match(/\b(\d{6})\b/);
  return {
    "@type": "PostalAddress",
    streetAddress: address,
    addressLocality: "Lucknow",
    addressRegion: "Uttar Pradesh",
    postalCode: postal?.[1] || "226016",
    addressCountry: "IN",
  };
}

function businessNode(content, meta) {
  const site = content.site || {};
  const contact = content.contact || {};
  const siteUrl = site.url || "";
  const geo = businessGeo(content);
  const hours = openingHours(contact.hours);
  const node = {
    "@type": ["MedicalBusiness", "MedicalOrganization"],
    "@id": `${abs(siteUrl, "/")}#business`,
    name: site.name,
    url: abs(siteUrl, "/"),
    description: meta?.description || site.tagline,
    slogan: site.tagline || undefined,
    foundingDate: site.established ? String(site.established) : undefined,
    image: meta?.ogImage || undefined,
    logo: abs(siteUrl, site.logoUrl || "/logo.png"),
    telephone: contact.phones || undefined,
    medicalSpecialty: "Nursing",
    address: postalAddress(content),
    areaServed: {
      "@type": "City",
      name: "Lucknow",
      containedInPlace: { "@type": "State", name: "Uttar Pradesh" },
    },
    hasMap: contact.address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`
      : undefined,
    sameAs: socialProfiles(contact).map((item) => item.url),
  };
  if (geo) node.geo = { "@type": "GeoCoordinates", ...geo };
  if (hours) node.openingHoursSpecification = hours;
  return node;
}

function crumbs(items) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function itemList(name, entries) {
  return {
    "@type": "ItemList",
    name,
    itemListElement: entries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      url: entry.url,
    })),
  };
}

export function buildStructuredData({ content, meta, pageKey, service, event, post, job, noindex }) {
  if (!content || !meta || noindex) return [];
  const siteUrl = content.site?.url || "";
  const home = abs(siteUrl, "/");
  const homeName = content.labels?.homeBreadcrumb || "Home";
  const graph = [];

  const crumb = (extra) => crumbs([{ name: homeName, url: home }, ...extra]);

  if (pageKey === "home") {
    graph.push(businessNode(content, meta));
    graph.push({
      "@type": "WebSite",
      "@id": `${home}#website`,
      url: home,
      name: content.site?.name,
      description: meta.description,
      inLanguage: "en-IN",
      publisher: { "@id": `${home}#business` },
    });
  } else if (pageKey === "about") {
    graph.push({
      "@type": "AboutPage",
      url: meta.canonical,
      name: meta.title,
      description: meta.description,
      mainEntity: { "@id": `${home}#business` },
    });
    graph.push(businessNode(content, meta));
    graph.push(crumb([{ name: content.pages?.about?.title || "About", url: meta.canonical }]));
  } else if (pageKey === "contact") {
    graph.push({
      "@type": "ContactPage",
      url: meta.canonical,
      name: meta.title,
      description: meta.description,
      mainEntity: { "@id": `${home}#business` },
    });
    graph.push(businessNode(content, meta));
    graph.push(crumb([{ name: content.pages?.contact?.title || "Contact", url: meta.canonical }]));
  } else if (pageKey === "services") {
    const services = [...(content.services || [])].sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
    graph.push(
      itemList(
        content.pages?.services?.title || "Services",
        services.map((item) => ({ name: item.title, url: abs(siteUrl, `/services/${item.id}`) }))
      )
    );
    graph.push(crumb([{ name: content.pages?.services?.title || "Services", url: meta.canonical }]));
  } else if (pageKey === "events") {
    const events = (content.events || []).filter((item) => item.published !== false);
    graph.push(
      itemList(
        content.pages?.events?.title || "Events",
        events.map((item) => ({ name: item.title, url: abs(siteUrl, `/events/${item.id}`) }))
      )
    );
    graph.push(crumb([{ name: content.pages?.events?.title || "Events", url: meta.canonical }]));
  } else if (pageKey === "blog") {
    const posts = (content.posts || []).filter((item) => item.published !== false);
    graph.push(
      itemList(
        content.pages?.blog?.title || "Blog",
        posts.map((item) => ({ name: item.title, url: abs(siteUrl, `/blog/${item.id}`) }))
      )
    );
    graph.push(crumb([{ name: content.pages?.blog?.title || "Blog", url: meta.canonical }]));
  } else if (pageKey === "jobs") {
    const jobs = (content.jobs || []).filter((item) => item.published !== false);
    graph.push(
      itemList(
        "Careers",
        jobs.map((item) => ({ name: item.title, url: abs(siteUrl, `/jobs/${item.id}`) }))
      )
    );
    graph.push(crumb([{ name: "Careers", url: meta.canonical }]));
  } else if (service) {
    const area = service.seo?.geoCity || "Lucknow";
    const node = {
      "@type": "Service",
      name: service.title,
      description: service.description || service.shortDescription,
      serviceType: service.category,
      url: meta.canonical,
      image: meta.ogImage || undefined,
      areaServed: {
        "@type": "City",
        name: area,
        containedInPlace: { "@type": "State", name: service.seo?.geoRegion || "Uttar Pradesh" },
      },
      provider: { "@id": `${home}#business` },
    };
    const price = String(service.price || "").replace(/[^\d.]/g, "");
    if (price) {
      node.offers = {
        "@type": "Offer",
        price,
        priceCurrency: "INR",
        url: meta.canonical,
      };
    }
    graph.push(businessNode(content, meta));
    graph.push(node);
    graph.push(
      crumb([
        { name: content.pages?.services?.title || "Services", url: abs(siteUrl, "/services") },
        { name: service.title, url: meta.canonical },
      ])
    );
  } else if (event) {
    graph.push({
      "@type": "Event",
      name: event.title,
      description: event.description,
      startDate: event.date,
      endDate: event.endDate || event.date,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      image: meta.ogImage || undefined,
      location: {
        "@type": "Place",
        name: event.location,
        address: postalAddress(content),
      },
      organizer: { "@id": `${home}#business` },
    });
    graph.push(businessNode(content, meta));
    graph.push(
      crumb([
        { name: content.pages?.events?.title || "Events", url: abs(siteUrl, "/events") },
        { name: event.title, url: meta.canonical },
      ])
    );
  } else if (post) {
    graph.push({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      dateModified: post.date,
      author: { "@type": "Organization", name: post.author || content.site?.name },
      image: meta.ogImage || undefined,
      url: meta.canonical,
      mainEntityOfPage: meta.canonical,
      publisher: {
        "@type": "Organization",
        name: content.site?.name,
        logo: { "@type": "ImageObject", url: abs(siteUrl, content.site?.logoUrl || "/logo.png") },
      },
    });
    graph.push(
      crumb([
        { name: content.pages?.blog?.title || "Blog", url: abs(siteUrl, "/blog") },
        { name: post.title, url: meta.canonical },
      ])
    );
  } else if (job) {
    const posting = buildJobPosting(job, content);
    delete posting["@context"];
    graph.push(posting);
    graph.push(
      crumb([
        { name: "Careers", url: abs(siteUrl, "/jobs") },
        { name: job.title, url: meta.canonical },
      ])
    );
  }

  const faqSource = service?.faq?.length ? service.faq : post?.faq?.length ? post.faq : null;
  if (faqSource) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faqSource.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    });
  }

  if (!graph.length) return [];
  return [{ "@context": "https://schema.org", "@graph": graph }];
}
