import { Helmet } from "react-helmet-async";
import { mediaUrl } from "../utils/mediaUrl.js";

export default function SiteAssets({ site }) {
  if (!site) return null;
  return (
    <Helmet>
      <link
        rel="icon"
        type="image/png"
        href={mediaUrl(site.faviconUrl || "/uploads/logos/logo.png")}
      />
    </Helmet>
  );
}
