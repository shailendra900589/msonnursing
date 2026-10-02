/** Fallback values when older content.json is missing keys */
export const contentDefaults = {
  site: {
    logoUrl: "/uploads/logos/logo.png?v=2",
    faviconUrl: "/favicon.png?v=2",
    theme: {
      colors: {
        primary: "#0d3a8c",
        primarySoft: "#1a4fb3",
        accent: "#c41e2a",
        accentSoft: "#e63946",
        background: "#f4f7fb",
        surface: "#ffffff",
        text: "#1e293b",
        textMuted: "#64748b",
      },
      typography: {
        baseFontSize: "16",
        headingScale: "1",
        headingWeight: "700",
        bodyWeight: "400",
        fontFamily: "DM Sans, system-ui, sans-serif",
      },
    },
  },
  navigation: {
    main: [
      { to: "/", label: "Home", end: true },
      { to: "/about", label: "About" },
      { to: "/services", label: "Services" },
    ],
    footer: [
      { to: "/", label: "Home" },
      { to: "/about", label: "About" },
      { to: "/services", label: "Services" },
      { to: "/contact", label: "Contact" },
    ],
  },
  header: {
    phoneLine: "{{phone}}",
    emailLine: "{{email}}",
    navCtaLabel: "Contact",
    navCtaPath: "/contact",
    logoAlt: "Mson Nursing Services",
    tickerLines: [
      "Home nursing, elder care, and caregiver staff available across Lucknow",
      "Open roles are listed on Careers — apply with your resume",
      "Health camps and caregiver drives are listed under Events",
    ],
  },
  footer: {
    quickLinksTitle: "Quick links",
    contactTitle: "Contact",
    locationTitle: "Location",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7117.734058880034!2d81.00673622253323!3d26.875965440567718!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399be3005c31bebd%3A0x590111dd07e75df2!2sMSON%20NURSING%20SERVICES!5e0!3m2!1sen!2sin!4v1790873658295!5m2!1sen!2sin",
    copyrightPrefix: "©",
    copyrightSuffix: "Content from",
    sourceLinkLabel: "msonnursing.com",
  },
  forms: {
    contact: {
      formTitle: "Send an enquiry",
      mailSubjectPrefix: "Care enquiry from",
      nameLabel: "Full name",
      phoneLabel: "Phone",
      messageLabel: "Message",
      namePlaceholder: "Your name",
      phonePlaceholder: "Mobile number",
      messagePlaceholder: "Describe care needs...",
      submitLabel: "Email enquiry",
    },
  },
  labels: {
    serviceLearnMore: "Learn more →",
    serviceBook: "Book this service",
    allServices: "All services",
    readOurStory: "Read our story →",
    backToServices: "Back to services",
    serviceNotFound: "Service not found",
    contactDetailsTitle: "Contact details",
    phoneLabel: "Phone",
    emailLabel: "Email",
    addressLabel: "Address",
    hoursLabel: "Hours",
    homeBreadcrumb: "Home",
    notFoundTitle: "Page not found",
    notFoundMessage: "The page you are looking for does not exist.",
    notFoundButton: "Back to home",
  },
  system: {
    loadErrorTitle: "Unable to load website",
    loadErrorMessage: "Start the backend API on port 5000, then refresh this page.",
  },
  pages: {
    home: {
      heroImageAlt: "Healthcare professional with patient",
      trustBadgeIcon: "+",
      featuredCount: 4,
      previewTitle: "Why families choose {{siteName}}",
      previewIntro: "",
      previewLinkText: "Read our story →",
      ctaCardTitle: "Need immediate assistance?",
      ctaCardText: "Speak with our care coordinator today.",
      ctaCardButton: "Call {{phone}}",
      stats: [
        { value: "8+", label: "Care programs" },
        { value: "2020", label: "Since" },
        { value: "24/7", label: "Enquiry line" },
      ],
    },
    about: {
      imageAlt: "Mson Nursing care team",
      yearBadgeLabel: "Year established",
    },
    contact: {},
  },
  blocks: {
    home: { whyItems: [], processSteps: [] },
    about: { values: [] },
    services: { standards: [] },
    contact: {},
  },
  events: [],
  posts: [],
  jobs: [],
  testimonials: [],
  pages: {
    events: {
      title: "Events, Camps & Campaigns",
      subtitle: "Community health programs",
    },
    blog: {
      title: "Nursing Care Blog",
      subtitle: "Tips and updates from our care team",
    },
    jobs: {
      title: "Careers",
      subtitle: "Open nursing and caregiver roles in Lucknow",
    },
  },
};

function isPlainObject(v) {
  return v && typeof v === "object" && !Array.isArray(v);
}

export function mergeContent(stored) {
  const merge = (base, over) => {
    if (!isPlainObject(base) && !Array.isArray(base)) return over ?? base;
    if (Array.isArray(base)) return Array.isArray(over) ? over : base;
    const out = { ...base };
    if (!isPlainObject(over)) return out;
    for (const key of Object.keys(over)) {
      out[key] = isPlainObject(base[key]) ? merge(base[key], over[key]) : over[key];
    }
    return out;
  };
  return merge(contentDefaults, stored);
}
