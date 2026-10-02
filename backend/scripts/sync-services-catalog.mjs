import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const catalogPath = join(root, "src/data/servicesCatalog.json");
const contentPath = join(root, "src/data/content.json");

function slug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

const catalog = JSON.parse(readFileSync(catalogPath, "utf-8"));
const content = JSON.parse(readFileSync(contentPath, "utf-8"));

const siteName = content.site?.name || "Mson Nursing Services";
const loc = "Lucknow";

content.services = catalog.map((item) => {
  const id = item.id || slug(item.title);
  const shortDescription = item.shortDescription || item.note || item.title;
  const priceLine = item.price ? `Starting ${item.price}${item.priceNote ? ` (${item.priceNote})` : ""}.` : "Contact for pricing.";
  return {
    id,
    title: item.title,
    shortDescription,
    description: `${item.title} in ${loc} by ${siteName}. ${shortDescription} ${priceLine} Trained male & female nursing staff for home visits.`,
    price: item.price || "",
    priceNote: item.priceNote || "",
    category: item.category || "home-nursing",
    features: item.features || [
      "Verified male & female staff",
      "Home visit service in Lucknow",
      "Hygiene-first nursing protocols",
      "Call to book same-day support",
    ],
    icon: item.icon || "nurse",
    image: item.image || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80",
    seo: {
      title: `${item.title} | ${siteName} ${loc}`,
      description: `${shortDescription} ${priceLine}`.slice(0, 160),
      keywords: `${item.title}, ${item.title} ${loc}, home nursing services, nursing care at home`,
    },
  };
});

content.pages.home.stats = [
  { value: `${content.services.length}+`, label: "Care services" },
  { value: "2020", label: "Since" },
  { value: "24/7", label: "Enquiry line" },
];

writeFileSync(contentPath, `${JSON.stringify(content, null, 2)}\n`, "utf-8");
console.log(`Synced ${content.services.length} services into content.json`);
