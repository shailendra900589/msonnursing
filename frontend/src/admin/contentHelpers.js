export function setByPath(obj, path, value) {
  const keys = path.replace(/\[(\d+)\]/g, ".$1").split(".").filter(Boolean);
  let ref = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const next = keys[i + 1];
    if (ref[key] === undefined || ref[key] === null) {
      ref[key] = /^\d+$/.test(next) ? [] : {};
    }
    ref = ref[key];
  }
  ref[keys.at(-1)] = value;
}

export function newService() {
  return {
    id: `service-${Date.now()}`,
    title: "New Service",
    shortDescription: "",
    description: "",
    longContent: "",
    price: "",
    priceNote: "",
    category: "home-nursing",
    icon: "nurse",
    image: "",
    features: [],
    sortOrder: 999,
    idealFor: [],
    careSteps: [],
    faq: [],
    eeat: {},
    seo: {
      title: "",
      description: "",
      keywords: "",
      tags: "",
      geoCity: "Lucknow",
      geoRegion: "Uttar Pradesh",
      geoCountry: "IN",
      aeoSummary: "",
      sitemapPriority: "0.85",
      canonicalPath: "",
    },
  };
}

export function isImageField(fieldName) {
  return ["image", "heroImage", "logoUrl", "faviconUrl", "ogImage"].includes(fieldName);
}

export function uploadFolderForField(fieldName, pathPrefix) {
  if (fieldName === "logoUrl" || fieldName === "faviconUrl") return "logos";
  if (fieldName === "ogImage") return "seo";
  if (pathPrefix.startsWith("services") || /^services\.\d+/.test(pathPrefix)) return "services";
  if (pathPrefix.startsWith("events") || /^events\.\d+/.test(pathPrefix)) return "events";
  if (pathPrefix.startsWith("posts") || /^posts\.\d+/.test(pathPrefix)) return "images";
  return "images";
}

export function newPost() {
  return {
    id: `post-${Date.now()}`,
    title: "New blog article",
    excerpt: "",
    body: "",
    date: new Date().toISOString().slice(0, 10),
    author: "Mson Nursing Services",
    category: "Home Nursing",
    published: true,
    featured: false,
    image: "",
    faq: [],
    relatedServiceIds: [],
    seo: { title: "", description: "", keywords: "" },
  };
}

export function newEvent() {
  return {
    id: `event-${Date.now()}`,
    type: "camp",
    title: "New health camp",
    shortDescription: "",
    description: "",
    date: new Date().toISOString().slice(0, 10),
    endDate: "",
    time: "",
    location: "Lucknow",
    featured: false,
    published: true,
    image: "",
    highlights: [],
    registrationForm: {
      useCustomFields: false,
      formTitle: "",
      submitLabel: "",
      fields: [],
    },
    seo: { title: "", description: "", keywords: "" },
  };
}

export function newJob() {
  const today = new Date();
  const later = new Date(today);
  later.setDate(later.getDate() + 60);
  const iso = (date) => date.toISOString().slice(0, 10);
  return {
    id: `job-${Date.now()}`,
    title: "New job",
    summary: "",
    description: "",
    datePosted: iso(today),
    validThrough: iso(later),
    employmentType: "FULL_TIME",
    workplace: "ONSITE",
    streetAddress: "",
    addressLocality: "Lucknow",
    addressRegion: "Uttar Pradesh",
    postalCode: "226016",
    addressCountry: "IN",
    salaryMin: "",
    salaryMax: "",
    salaryUnit: "MONTH",
    published: false,
  };
}

export const EVENT_TYPES = ["camp", "campaign", "event", "drive"];

export const ICON_OPTIONS = [
  "heart-pulse",
  "baby",
  "home-health",
  "physio",
  "nurse",
  "attendant-m",
  "attendant-f",
  "elder",
  "stethoscope",
  "shield-check",
  "clock",
  "phone",
  "award",
  "clipboard",
  "cross",
  "syringe",
  "bandage",
  "iv",
];

const ICON_LABELS = {
  "heart-pulse": "Heart / care",
  baby: "Baby care",
  "home-health": "Home health",
  physio: "Physiotherapy",
  nurse: "Nurse",
  "attendant-m": "Male attendant",
  "attendant-f": "Female attendant",
  elder: "Elder care",
  stethoscope: "Stethoscope",
  "shield-check": "Verified / safety",
  clock: "24/7 / timing",
  phone: "Phone / call",
  award: "Award / quality",
  clipboard: "Clinical notes",
  cross: "Medical plus",
  syringe: "Injection",
  bandage: "Wound dressing",
  iv: "IV / drip",
};

export function iconLabel(id) {
  return ICON_LABELS[id] || id.replace(/-/g, " ");
}
