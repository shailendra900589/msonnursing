import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const contentPath = join(dirname(fileURLToPath(import.meta.url)), "../src/data/content.json");
const content = JSON.parse(readFileSync(contentPath, "utf-8"));

content.pages = content.pages || {};
content.pages.blog = {
  title: "Nursing Care Blog",
  subtitle: "Home nursing tips, elder care guides, and health updates from Mson Nursing Services Lucknow.",
};

content.navigation.main = content.navigation.main.filter((l) => l.to !== "/blog");
content.navigation.main.splice(4, 0, { to: "/blog", label: "Blog" });
content.navigation.footer = content.navigation.footer.filter((l) => l.to !== "/blog");
const footerIdx = content.navigation.footer.findIndex((l) => l.to === "/events");
content.navigation.footer.splice(footerIdx + 1, 0, { to: "/blog", label: "Blog" });

content.labels = content.labels || {};
content.labels.backToBlog = "Back to blog";

content.posts = [
  {
    id: "home-nursing-guide-lucknow",
    title: "Complete Guide to Home Nursing Services in Lucknow",
    excerpt: "How to choose GDA staff, registered nurses, and visit-based care for elders and post-surgery patients at home.",
    body: "Home nursing services in Lucknow help families manage elder care, injections, IV drips, wound dressing, and long-term patient support without hospital stays.\n\nMson Nursing Services provides trained male and female GDA staff, registered nurses, and per-visit clinical procedures with clear pricing.\n\nCall our coordinator to match staff to your care plan, timing, and location in Lucknow.",
    date: "2026-03-15",
    author: "Mson Nursing Services",
    category: "Home Nursing",
    published: true,
    featured: true,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80",
    seo: { title: "", description: "", keywords: "" },
  },
  {
    id: "elder-care-at-home-tips",
    title: "Elder Care at Home: Safety, Hygiene & Daily Routines",
    excerpt: "Practical tips for families hiring elder care takers and GDA attendants in Lucknow.",
    body: "Elder care at home requires consistent hygiene, medication reminders, mobility support, and compassionate companionship.\n\nOur GDA male and female staff are trained for 12-hour shifts and long-term elder assignments.\n\nContact Mson Nursing Services for screened caregivers near Indira Nagar and across Lucknow.",
    date: "2026-03-01",
    author: "Mson Nursing Services",
    category: "Elder Care",
    published: true,
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=80",
    seo: { title: "", description: "", keywords: "" },
  },
  {
    id: "injection-iv-services-at-home",
    title: "Injections, IV Drip & Catheter Care at Your Doorstep",
    excerpt: "When to book a nurse visit for TT, IV fluids, cannula, and catheter care — and what to expect.",
    body: "Visit-based nursing includes IM injections, TT, IV line setup, saline drips, wound dressing, and catheter changes.\n\nMedical consumables are typically not included in base visit fees — our team explains this before booking.\n\nBook a trained nurse visit in Lucknow starting from transparent per-visit rates.",
    date: "2026-02-20",
    author: "Mson Nursing Services",
    category: "Clinical Visits",
    published: true,
    image: "https://images.unsplash.com/photo-1631217868264-e5b1bb5e2abb?auto=format&fit=crop&w=900&q=80",
    seo: { title: "", description: "", keywords: "" },
  },
];

writeFileSync(contentPath, `${JSON.stringify(content, null, 2)}\n`, "utf-8");
console.log("Blog page, navigation, and sample posts added.");
