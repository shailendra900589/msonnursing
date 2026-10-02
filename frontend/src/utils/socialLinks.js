const DEFAULT_SOCIAL = [
  {
    id: "instagram",
    label: "Instagram",
    url: "https://www.instagram.com/msonnursingservices/",
  },
  {
    id: "youtube",
    label: "YouTube",
    url: "https://www.youtube.com/@MsonNursingServices",
  },
];

function profile(item) {
  const url = String(item?.url || "").trim();
  if (!/^https?:\/\//i.test(url)) return null;
  const id = String(item.id || "").trim().toLowerCase() || url;
  return {
    id,
    label: String(item.label || id).trim() || id,
    url,
  };
}

/** Official profiles, then any extra links saved in the CMS. Later entries with the same id replace the default. */
export function socialProfiles(contact) {
  const saved = [
    contact?.instagram ? { id: "instagram", label: "Instagram", url: contact.instagram } : null,
    contact?.youtube ? { id: "youtube", label: "YouTube", url: contact.youtube } : null,
    ...(Array.isArray(contact?.social) ? contact.social : []),
  ];
  const merged = new Map();
  for (const item of DEFAULT_SOCIAL) {
    const next = profile(item);
    if (next) merged.set(next.id, next);
  }
  for (const item of saved) {
    const next = profile(item);
    if (next) merged.set(next.id, next);
  }
  return [...merged.values()];
}
