import { vendorCreditLine, vendorSiteUrl } from "../platform/releaseMeta.js";

export default function AgencyAttribution({ className = "" }) {
  const url = vendorSiteUrl();

  return (
    <p className={`agency-attribution ${className}`.trim()}>
      {vendorCreditLine()}. Website:{" "}
      <a href={url} target="_blank" rel="noopener noreferrer">
        www.nectradigital.com
      </a>
    </p>
  );
}
