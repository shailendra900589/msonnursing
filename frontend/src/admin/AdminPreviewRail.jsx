import { useEffect, useRef, useState } from "react";
import { Eye, ExternalLink, ListTree, Palette, X } from "lucide-react";
import { useAdminEditor } from "./AdminEditorContext.jsx";
import { sectionPreviewLabel, sectionPreviewPath } from "./previewMap.js";
import { buildPreviewSrc, formatPreviewPath } from "./previewUrls.js";
import { openFullPreview } from "./previewSync.js";
import { usePreviewScale } from "./usePreviewScale.js";
import AdminAppearanceEditor from "./AdminAppearanceEditor.jsx";

const TABS = [
  { id: "preview", label: "Live", icon: Eye },
  { id: "changes", label: "Changes", icon: ListTree },
  { id: "style", label: "Styles", icon: Palette },
];

export default function AdminPreviewRail({ onClose }) {
  const { section, pageTab, data, update, changes, pushPreview, previewVersion, saving } = useAdminEditor();
  const [tab, setTab] = useState("preview");
  const iframeRef = useRef(null);
  const scalerRef = useRef(null);
  const { scale, width, height, scaledWidth, scaledHeight } = usePreviewScale(scalerRef);
  const previewKey = section === "pages" ? pageTab : section;
  const path = sectionPreviewPath(previewKey);
  const pathLabel = formatPreviewPath(path);
  const src = buildPreviewSrc(path);
  const changeCount = changes.length;
  const live = changeCount > 0 || saving;

  useEffect(() => {
    if (tab !== "preview") return;
    const t = window.setTimeout(() => {
      pushPreview(iframeRef.current?.contentWindow);
    }, 80);
    return () => window.clearTimeout(t);
  }, [tab, path, previewVersion, pushPreview, data]);

  const openFull = () => {
    const win = openFullPreview(path);
    window.setTimeout(() => pushPreview(win), 400);
  };

  return (
    <aside className="admin-preview-rail" aria-label="Live preview panel">
      <div className="admin-preview-rail-head">
        <div className="admin-preview-head-row">
          <strong>{sectionPreviewLabel(previewKey)}</strong>
          <div className="admin-preview-head-actions">
            {live ? <span className="admin-live-pill">Live edits</span> : <span className="admin-live-pill admin-live-pill--idle">Synced</span>}
            {onClose ? (
              <button type="button" className="admin-preview-close" aria-label="Close preview" onClick={onClose}>
                <X size={20} aria-hidden />
              </button>
            ) : null}
          </div>
        </div>
        {pathLabel ? <span className="admin-preview-path">{pathLabel}</span> : null}
        <button type="button" className="admin-preview-open-full" onClick={openFull}>
          <ExternalLink size={15} aria-hidden />
          Open full preview tab
        </button>
      </div>

      <div className="admin-preview-tabs" role="tablist">
        {TABS.map((t) => {
          const Icon = t.icon;
          const label = t.id === "changes" && changeCount ? `${t.label} (${changeCount})` : t.label;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={tab === t.id ? "active" : ""}
              onClick={() => setTab(t.id)}
            >
              <Icon size={15} aria-hidden />
              {label}
            </button>
          );
        })}
      </div>

      {tab === "preview" ? (
        <div className="admin-preview-frame-outer" ref={scalerRef}>
          <div
            className="admin-preview-scaler"
            style={{ width: scaledWidth, height: scaledHeight }}
          >
            <iframe
              ref={iframeRef}
              title="Live site preview"
              className="admin-preview-frame"
              src={src}
              style={{
                width,
                height,
                transform: `scale(${scale})`,
              }}
            />
          </div>
        </div>
      ) : null}

      {tab === "changes" ? (
        <div className="admin-changes-list">
          {changeCount === 0 ? (
            <p className="admin-changes-empty">Edit any field — changes appear here and in preview instantly.</p>
          ) : (
            <ul>
              {changes.map((c) => (
                <li key={c.path}>
                  <strong>{c.label}</strong>
                  <span className="admin-change-where">{c.where}</span>
                  <div className="admin-change-diff">
                    <span>{c.before}</span>
                    <span aria-hidden>→</span>
                    <span className="admin-change-new">{c.after}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

      {tab === "style" && data ? (
        <div className="admin-preview-style-scroll">
          <AdminAppearanceEditor data={data} update={update} />
        </div>
      ) : null}
    </aside>
  );
}
