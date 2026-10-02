function isPlain(v) {
  return v && typeof v === "object" && !Array.isArray(v);
}

function pathLabel(path) {
  const parts = path.replace(/\.\d+/g, "").split(".");
  const page = parts[0];
  const map = {
    pages: "Page",
    blocks: "Block",
    site: "Site",
    theme: "Style",
    navigation: "Menu",
    header: "Header",
    footer: "Footer",
    seo: "SEO",
    contact: "Contact",
    events: "Event",
    services: "Service",
    testimonials: "Testimonial",
    posts: "Blog post",
    highlights: "Highlight",
    labels: "Label",
    forms: "Form",
  };
  const last = parts[parts.length - 1] || path;
  const pretty = last
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
  const prefix = map[page] ? `${map[page]} · ` : "";
  return `${prefix}${pretty}`;
}

function previewHint(path) {
  if (path.startsWith("pages.home.hero")) return "Top hero banner";
  if (path.startsWith("pages.home")) return "Homepage";
  if (path.startsWith("blocks.home")) return "Homepage sections";
  if (path.startsWith("site.theme")) return "Whole site colors & text";
  if (path.startsWith("pages.about")) return "About page header";
  if (path.startsWith("pages.services")) return "Services page";
  if (path.startsWith("pages.contact")) return "Contact page";
  if (path.startsWith("pages.events")) return "Events page";
  if (path.startsWith("navigation")) return "Header / footer menus";
  if (path.startsWith("header")) return "Top bar";
  if (path.startsWith("footer")) return "Footer";
  if (path.startsWith("contact.")) return "Contact info & WhatsApp";
  if (path.startsWith("events.")) return "Events & camps";
  if (path.startsWith("services.")) return "Service cards & detail pages";
  if (path.startsWith("testimonials.")) return "Testimonials on home";
  if (path.startsWith("posts.")) return "Blog articles";
  if (path.startsWith("pages.blog")) return "Blog listing page";
  if (path === "highlights" || path.startsWith("highlights.")) return "Home bullet list";
  return "Site content";
}

export function diffContent(baseline, current, max = 40) {
  if (!baseline || !current) return [];
  const changes = [];

  const walk = (a, b, prefix) => {
    if (changes.length >= max) return;
    if (a === b) return;
    if (Array.isArray(a) && Array.isArray(b)) {
      const len = Math.max(a.length, b.length);
      for (let i = 0; i < len; i += 1) {
        walk(a[i], b[i], `${prefix}.${i}`);
      }
      return;
    }
    if (isPlain(a) && isPlain(b)) {
      const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
      for (const key of keys) {
        walk(a[key], b[key], prefix ? `${prefix}.${key}` : key);
      }
      return;
    }
    const path = prefix || "content";
    changes.push({
      path,
      label: pathLabel(path),
      where: previewHint(path),
      before: truncate(a),
      after: truncate(b),
    });
  };

  walk(baseline, current, "");
  return changes;
}

function truncate(val) {
  if (val == null) return "—";
  if (typeof val === "boolean") return val ? "Yes" : "No";
  const s = String(val);
  return s.length > 48 ? `${s.slice(0, 45)}…` : s;
}
