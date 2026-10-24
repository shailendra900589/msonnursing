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

function resolveServiceImage(item) {
  if (item.image) return item.image;
  const cat = (item.category || "").toLowerCase();
  const title = (item.title || "").toLowerCase();

  if (cat.includes("baby") || title.includes("baby") || title.includes("ayas")) {
    return "/images/services/service-baby.jpg";
  }
  if (cat.includes("physio") || title.includes("physio")) {
    return "/images/services/service-physio.jpg";
  }
  if (cat.includes("wound") || title.includes("wound") || title.includes("dressing") || title.includes("bandage")) {
    return "/images/services/service-wound.jpg";
  }
  if (
    cat.includes("injection") ||
    title.includes("injection") ||
    title.includes(" tt ") ||
    title.includes("tt injection")
  ) {
    return "/images/services/service-injection.jpg";
  }
  if (
    cat.includes("iv") ||
    title.includes("iv") ||
    title.includes("drip") ||
    title.includes("saline") ||
    title.includes("cannula") ||
    title.includes("o2") ||
    title.includes("oxygen")
  ) {
    return "/images/services/service-iv.jpg";
  }
  if (cat.includes("elder") || title.includes("elder") || title.includes("old age")) {
    return "/images/services/service-elderly.jpg";
  }
  if (
    cat.includes("gda") ||
    cat.includes("attendant") ||
    cat.includes("caretaker") ||
    title.includes("gda") ||
    title.includes("attendant") ||
    title.includes("care taker")
  ) {
    return "/images/services/service-gda.jpg";
  }
  return "/images/services/service-nurse.jpg";
}

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
    image: resolveServiceImage(item),
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
