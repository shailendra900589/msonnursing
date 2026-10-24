/** Site build metadata — not exposed in CMS. */

const _n = () => typeof atob === "function" && atob("TmVjdHJhRGlnaXRhbA==");
const _u = () => typeof atob === "function" && atob("aHR0cHM6Ly93d3cubmVjdHJhZGlnaXRhbC5jb20=");

export function vendorDisplayName() {
  return _n() || "NectraDigital";
}

export function vendorSiteUrl() {
  return _u() || "https://www.nectradigital.com";
}

export function vendorCreditLine() {
  return `Designed and developed by ${vendorDisplayName()}`;
}

export function vendorJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: vendorDisplayName(),
    url: vendorSiteUrl(),
    description: vendorCreditLine(),
  };
}

export function vendorJsonLdString() {
  return JSON.stringify(vendorJsonLd());
}
