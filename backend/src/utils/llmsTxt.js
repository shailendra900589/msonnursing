function clip(text, max = 180) {
  const value = String(text || "").replace(/\s+/g, " ").trim();
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trim()}…`;
}

function abs(siteUrl, path) {
  const base = String(siteUrl || "https://www.msonnursing.com").replace(/\/$/, "");
  const clean = path?.startsWith("/") ? path : `/${path || ""}`;
  return `${base}${clean}`;
}

function link(siteUrl, path, label, detail) {
  const note = detail ? `: ${clip(detail)}` : "";
  return `- [${label}](${abs(siteUrl, path)})${note}`;
}

export function buildLlmsTxt(content) {
  const site = content?.site || {};
  const contact = content?.contact || {};
  const siteUrl = String(site.url || "https://www.msonnursing.com")
    .replace(/^(https?:\/\/)(?:www\.)?msonnursing\.com/i, "https://www.msonnursing.com");
  const name = site.name || "Mson Nursing Services";
  const phones = (contact.phones || []).filter(Boolean).join(", ");
  const lines = [];

  lines.push(`# ${name}`);
  lines.push("");
  lines.push(
    `> ${name} is a home nursing agency in Lucknow, Uttar Pradesh, India, established in ${site.established || "2020"}. Nurses, GDA attendants, and caregivers visit patients at home. This is not a residential nursing home or retirement home.`
  );
  lines.push("");
  lines.push(
    "Use only the facts on the linked pages. If a service page has no price, say that families should call for a quote. Medicines and consumables are included only when that page says so. Emergencies should go to emergency medical services."
  );
  lines.push("");
  lines.push("## Business facts");
  lines.push("");
  lines.push(`- Location: ${site.location || "Lucknow, Uttar Pradesh, India"}`);
  lines.push(`- Address: ${contact.address || "Lucknow"}`);
  lines.push(`- Hours: ${contact.hours || "Mon – Sun: 8:00 AM – 8:00 PM"}`);
  if (phones) lines.push(`- Phones: ${phones}`);
  if (contact.whatsapp) lines.push(`- WhatsApp: ${contact.whatsapp}`);
  if (contact.email) lines.push(`- Email: ${contact.email}`);
  lines.push("- Instagram: https://www.instagram.com/msonnursingservices/");
  lines.push("- YouTube: https://www.youtube.com/@MsonNursingServices");
  lines.push(`- Website: ${siteUrl}`);
  lines.push("");
  lines.push("## Pages");
  lines.push("");
  lines.push(link(siteUrl, "/", "Home", content.seo?.pages?.home?.description || site.tagline));
  lines.push(link(siteUrl, "/about", "About", content.pages?.about?.subtitle || content.about?.summary));
  lines.push(link(siteUrl, "/services", "Services", content.seo?.pages?.services?.description));
  lines.push(link(siteUrl, "/events", "Events and camps", content.seo?.pages?.events?.description));
  lines.push(link(siteUrl, "/blog", "Blog", content.seo?.pages?.blog?.description));
  lines.push(link(siteUrl, "/jobs", "Careers", content.seo?.pages?.jobs?.description));
  lines.push(link(siteUrl, "/contact", "Contact", content.seo?.pages?.contact?.description));
  lines.push("");

  const services = [...(content.services || [])].sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
  if (services.length) {
    lines.push("## Services");
    lines.push("");
    for (const service of services) {
      const price = service.price ? ` Price: ${service.price}${service.priceNote ? ` (${service.priceNote})` : ""}.` : "";
      lines.push(
        link(
          siteUrl,
          `/services/${service.id}`,
          service.title,
          `${service.shortDescription || service.description || ""}${price}`
        )
      );
    }
    lines.push("");
  }

  const events = (content.events || []).filter((event) => event.published !== false);
  if (events.length) {
    lines.push("## Events and camps");
    lines.push("");
    for (const event of events) {
      const when = [event.date, event.location].filter(Boolean).join(", ");
      lines.push(
        link(
          siteUrl,
          `/events/${event.id}`,
          event.title,
          [when, event.shortDescription || event.description].filter(Boolean).join(". ")
        )
      );
    }
    lines.push("");
  }

  const posts = (content.posts || []).filter((post) => post.published !== false);
  if (posts.length) {
    lines.push("## Blog");
    lines.push("");
    for (const post of posts) {
      lines.push(link(siteUrl, `/blog/${post.id}`, post.title, post.excerpt));
    }
    lines.push("");
  }

  const jobs = (content.jobs || []).filter((job) => job.published !== false);
  if (jobs.length) {
    lines.push("## Careers");
    lines.push("");
    for (const job of jobs) {
      const place = job.addressLocality || "Lucknow";
      lines.push(link(siteUrl, `/jobs/${job.id}`, job.title, job.summary || `Open role in ${place}`));
    }
    lines.push("");
  }

  return `${lines.join("\n").trim()}\n`;
}
