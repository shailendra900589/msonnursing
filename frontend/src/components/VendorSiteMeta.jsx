import { Helmet } from "react-helmet-async";
import { mediaUrl } from "../utils/mediaUrl.js";
import {
  vendorCreditLine,
  vendorDisplayName,
  vendorJsonLdString,
  vendorSiteUrl,
} from "../platform/releaseMeta.js";

/** Global head tags on every public page (not CMS-editable). */
export default function VendorSiteMeta({ site }) {
  const name = vendorDisplayName();
  const url = vendorSiteUrl();
  const line = vendorCreditLine();
  const favicon = site ? mediaUrl(site.faviconUrl || site.logoUrl || "/uploads/logos/logo.png") : null;

  return (
    <Helmet>
      {favicon ? <link rel="icon" type="image/png" href={favicon} /> : null}
      <meta name="author" content={name} />
      <meta name="designer" content={`${line}. ${url}`} />
      <meta name="creator" content={name} />
      <meta property="og:see_also" content={url} />
      <script type="application/ld+json">{vendorJsonLdString()}</script>
    </Helmet>
  );
}
