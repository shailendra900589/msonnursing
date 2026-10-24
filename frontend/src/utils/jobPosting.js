export const EMPLOYMENT_TYPES = [
  ["FULL_TIME", "Full-time"],
  ["PART_TIME", "Part-time"],
  ["CONTRACTOR", "Contract"],
  ["TEMPORARY", "Temporary"],
  ["INTERN", "Internship"],
  ["VOLUNTEER", "Volunteer"],
  ["PER_DIEM", "Per diem"],
  ["OTHER", "Other"],
];

export const SALARY_UNITS = [
  ["HOUR", "Per hour"],
  ["DAY", "Per day"],
  ["MONTH", "Per month"],
  ["YEAR", "Per year"],
];

export function employmentLabel(value) {
  return EMPLOYMENT_TYPES.find(([id]) => id === value)?.[1] || "Full-time";
}

export function salaryUnitLabel(value) {
  return SALARY_UNITS.find(([id]) => id === value)?.[1] || "Per month";
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function absoluteUrl(siteUrl, path) {
  const base = String(siteUrl || "").replace(/\/$/, "");
  const clean = String(path || "");
  if (!clean) return base;
  if (clean.startsWith("http")) return clean;
  return `${base}${clean.startsWith("/") ? clean : `/${clean}`}`;
}

export function jobDescriptionHtml(job) {
  const parts = [job.summary, job.description].filter(Boolean).join("\n\n");
  return parts
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join("");
}

/** Schema.org JobPosting for Google for Jobs. One object per public job URL. */
export function buildJobPosting(job, content) {
  const site = content?.site || {};
  const contact = content?.contact || {};
  const description = jobDescriptionHtml(job);
  const data = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description,
    identifier: {
      "@type": "PropertyValue",
      name: site.name || "Mson Nursing Services",
      value: job.id,
    },
    datePosted: job.datePosted,
    employmentType: job.employmentType || "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: site.name || "Mson Nursing Services",
      sameAs: site.url || undefined,
      logo: absoluteUrl(site.url, site.logoUrl || "/logo.png"),
    },
    directApply: true,
    url: absoluteUrl(site.url, `/jobs/${job.id}`),
  };

  if (job.validThrough) {
    data.validThrough = `${job.validThrough}T23:59:59+05:30`;
  }

  if (job.workplace === "TELECOMMUTE") {
    data.jobLocationType = "TELECOMMUTE";
    data.applicantLocationRequirements = {
      "@type": "Country",
      name: job.addressCountry === "IN" ? "India" : job.addressCountry || "India",
    };
  } else {
    data.jobLocation = {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: job.streetAddress || contact.address || "",
        addressLocality: job.addressLocality || "Lucknow",
        addressRegion: job.addressRegion || "Uttar Pradesh",
        postalCode: job.postalCode || "",
        addressCountry: job.addressCountry || "IN",
      },
    };
  }

  const min = Number(job.salaryMin);
  const max = Number(job.salaryMax);
  if (min > 0 || max > 0) {
    data.baseSalary = {
      "@type": "MonetaryAmount",
      currency: "INR",
      value: {
        "@type": "QuantitativeValue",
        minValue: min > 0 ? min : max,
        maxValue: max > 0 ? max : min,
        unitText: job.salaryUnit || "MONTH",
      },
    };
  }

  return data;
}
