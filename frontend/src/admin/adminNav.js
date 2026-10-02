export const PAGE_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "events", label: "Events & camps" },
  { id: "blog", label: "Blog" },
  { id: "contact", label: "Contact" },
];

export const ADMIN_NAV = [
  {
    group: "Overview",
    items: [{ id: "dashboard", label: "Dashboard", icon: "home" }],
  },
  {
    group: "Pages",
    items: [{ id: "pages", label: "Edit pages", icon: "file-text", children: PAGE_LINKS }],
  },
  {
    group: "Website",
    items: [
      { id: "site", label: "Site & colors", icon: "globe" },
      { id: "layout", label: "Menus & layout", icon: "menu" },
      { id: "media", label: "Media library", icon: "image" },
      { id: "jobs", label: "Job posts", icon: "briefcase" },
    ],
  },
  {
    group: "Settings",
    items: [
      { id: "seo", label: "SEO & labels", icon: "search" },
      { id: "system", label: "System & JSON", icon: "settings" },
    ],
  },
];

export function findNavItem(id) {
  for (const group of ADMIN_NAV) {
    const hit = group.items.find((i) => i.id === id);
    if (hit) return { ...hit, group: group.group };
  }
  return { id, label: "CMS", icon: "settings", group: "" };
}
