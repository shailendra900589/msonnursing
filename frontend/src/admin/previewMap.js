const MAP = {
  dashboard: "/",
  pages: "/",
  home: "/",
  about: "/about",
  services: "/services",
  events: "/events",
  blog: "/blog",
  contact: "/contact",
  jobs: "/jobs",
  site: "/",
  layout: "/",
  media: "/",
  seo: "/",
  system: "/",
};

export function sectionPreviewPath(section) {
  return MAP[section] || "/";
}

export function sectionPreviewLabel(section) {
  const labels = {
    home: "Homepage",
    about: "About page",
    services: "Services",
    events: "Events",
    blog: "Blog",
    contact: "Contact page",
    jobs: "Careers",
    site: "Global styles",
    layout: "Header & menus",
    media: "Media",
    seo: "SEO preview",
    system: "Website",
  };
  return labels[section] || "Website preview";
}
