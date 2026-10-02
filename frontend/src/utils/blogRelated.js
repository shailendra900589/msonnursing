const CATEGORY_SERVICE_MAP = {
  "Home Nursing": ["home-health-care-service", "gda-male-and-female-12-hours", "registered-nurses-12-hours"],
  "Elder Care": ["elderly-care-service", "elder-care-nurse", "gda-male-and-female-12-hours"],
  "Clinical Visits": ["medical-care-nurse", "home-health-care-service", "registered-nurses-12-hours"],
};

export function pickRelatedPosts(allPosts, currentId, limit = 8) {
  const list = (allPosts || []).filter((p) => p.published !== false && p.id !== currentId);
  const current = (allPosts || []).find((p) => p.id === currentId);
  const cat = current?.category;

  const sameCat = list.filter((p) => p.category && p.category === cat);
  const other = list.filter((p) => !cat || p.category !== cat);
  const sorted = [
    ...sameCat.sort((a, b) => (b.date || "").localeCompare(a.date || "")),
    ...other.sort((a, b) => (b.date || "").localeCompare(a.date || "")),
  ];

  return sorted.slice(0, limit);
}

export function pickRelatedServices(allServices, post, limit = 4) {
  const services = allServices || [];
  const ids = post?.relatedServiceIds?.filter(Boolean) || [];
  const picked = [];

  for (const id of ids) {
    const s = services.find((x) => x.id === id);
    if (s) picked.push(s);
  }

  if (picked.length < limit) {
    const fallbackIds = CATEGORY_SERVICE_MAP[post?.category] || [
      "home-health-care-service",
      "elderly-care-service",
      "gda-male-and-female-12-hours",
      "registered-nurses-12-hours",
    ];
    for (const id of fallbackIds) {
      if (picked.length >= limit) break;
      if (picked.some((p) => p.id === id)) continue;
      const s = services.find((x) => x.id === id);
      if (s) picked.push(s);
    }
  }

  if (picked.length < limit) {
    for (const s of services) {
      if (picked.length >= limit) break;
      if (picked.some((p) => p.id === s.id)) continue;
      picked.push(s);
    }
  }

  return picked.slice(0, limit);
}

export function getPostFaq(post, siteName = "Mson Nursing Services", phone = "") {
  if (post?.faq?.length) return post.faq;
  return [
    {
      q: `How do I book nursing care after reading this article?`,
      a: `Call ${phone || "our coordinator"} or use the contact form on ${siteName}. Share patient details, location in Lucknow, and preferred timing.`,
    },
    {
      q: "Are home nurses and GDA staff verified?",
      a: `${siteName} coordinates identity checks, experience review, and orientation before staff starts duty at your home.`,
    },
  ];
}
