import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { StaticContentProvider } from "../context/ContentContext.jsx";
import { PREVIEW_STORAGE_KEY } from "../admin/previewConstants.js";
import { listenPreviewContent } from "../admin/previewSync.js";

function readDraft() {
  try {
    const raw = sessionStorage.getItem(PREVIEW_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function PreviewRoot() {
  const [content, setContent] = useState(readDraft);

  useEffect(() => listenPreviewContent(setContent), []);

  const previewReady =
    content &&
    content.site &&
    Array.isArray(content.services) &&
    content.pages &&
    typeof content.pages === "object";

  if (!previewReady) {
    return (
      <div className="preview-empty">
        <Helmet>
          <title>CMS preview</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <p>{content ? "Preview data is incomplete — save again from the admin panel." : "Waiting for CMS preview data…"}</p>
      </div>
    );
  }

  return (
    <StaticContentProvider content={content}>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Outlet />
    </StaticContentProvider>
  );
}
