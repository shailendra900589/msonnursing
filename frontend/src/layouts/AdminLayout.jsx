import { useEffect, useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { ChevronDown, ExternalLink, Eye, LogOut, Menu, Sparkles, UploadCloud, X } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { applyAutoSeo } from "../admin/seoAuto.js";
import { AUTH_KEY } from "../api/client.js";
import { AdminEditorProvider, useAdminEditor } from "../admin/AdminEditorContext.jsx";
import { ADMIN_NAV, PAGE_LINKS, findNavItem } from "../admin/adminNav.js";
import AdminNavIcon from "../admin/AdminNavIcon.jsx";
import AdminDashboard from "../admin/AdminDashboard.jsx";
import AdminPreviewRail from "../admin/AdminPreviewRail.jsx";
import "../admin/admin.css";

function AdminChrome() {
  const navigate = useNavigate();
  const {
    section,
    setSection,
    pageTab,
    setPageTab,
    leadsOpen,
    setLeadsOpen,
    save,
    saving,
    status,
    statusType,
    data,
    update,
    setStatus,
    setStatusType,
  } = useAdminEditor();

  const autoSeo = () => {
    if (!data) return;
    const next = applyAutoSeo(data);
    update(null, null, next);
    setStatus("SEO generated for all pages & services — click Publish.");
    setStatusType("success");
  };
  const pageLabel = PAGE_LINKS.find((page) => page.id === pageTab)?.label;
  const active =
    section === "dashboard" && leadsOpen
      ? { group: "Overview", label: "Leads" }
      : section === "pages" && pageLabel
        ? { group: "Pages", label: pageLabel }
        : findNavItem(section);
  const [navOpen, setNavOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);

  useEffect(() => {
    setNavOpen(false);
  }, [section]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setNavOpen(false);
        setPreviewOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("admin-drawer-open", navOpen || previewOpen);
    return () => document.body.classList.remove("admin-drawer-open");
  }, [navOpen, previewOpen]);

  const pickSection = (id) => {
    setSection(id);
    setLeadsOpen(false);
    setPagesOpen(false);
    setNavOpen(false);
  };

  const pickPage = (pageId) => {
    setSection("pages");
    setPageTab(pageId);
    setLeadsOpen(false);
    setPagesOpen(false);
    setNavOpen(false);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    navigate("/admin/login");
  };

  const shellClass = [
    "admin-shell",
    navOpen ? "admin-nav-open" : "",
    previewOpen ? "admin-preview-open" : "",
    section === "dashboard" ? "is-dashboard" : "",
    section === "dashboard" && leadsOpen ? "is-leads" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
    <Helmet>
      <title>Mson CMS</title>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
    <div className={shellClass}>
      <button
        type="button"
        className="admin-overlay"
        aria-label="Close menu"
        tabIndex={navOpen || previewOpen ? 0 : -1}
        onClick={() => {
          setNavOpen(false);
          setPreviewOpen(false);
        }}
      />

      <aside className="admin-sidebar">
        <div className="admin-sidebar-head">
          <Link to="/" className="admin-brand" onClick={() => setNavOpen(false)}>
            <img src="/favicon.png?v=2" alt="Mson Nursing Services" width={42} height={42} />
            <div>
              <strong>Mson CMS</strong>
              <small>Hospital website manager</small>
            </div>
          </Link>
          <button
            type="button"
            className="admin-sidebar-close"
            aria-label="Close menu"
            onClick={() => setNavOpen(false)}
          >
            <X size={22} aria-hidden />
          </button>
        </div>

        <button
          type="button"
          className="admin-save-btn"
          onClick={() => save()}
          disabled={saving}
        >
          <UploadCloud size={18} aria-hidden />
          {saving ? "Publishing…" : "Publish changes"}
        </button>

        {status ? (
          <p className={`admin-sidebar-status admin-sidebar-status--${statusType || "info"}`}>{status}</p>
        ) : null}

        <nav className="admin-side-nav" aria-label="CMS sections">
          {ADMIN_NAV.map((group) => (
            <div key={group.group} className="admin-nav-group">
              <span className="admin-nav-label">{group.group}</span>
              {group.items.map((item) =>
                item.children ? (
                  <div key={item.id} className={`admin-nav-dropdown ${pagesOpen ? "is-open" : ""}`}>
                    <button
                      type="button"
                      className={section === item.id ? "active admin-nav-parent" : "admin-nav-parent"}
                      aria-expanded={pagesOpen}
                      aria-controls="admin-pages-menu"
                      onClick={() => setPagesOpen((open) => !open)}
                    >
                      <AdminNavIcon name={item.icon} />
                      <span>{item.label}</span>
                      <ChevronDown size={16} aria-hidden className="admin-nav-chevron" />
                    </button>
                    <div className="admin-nav-drop" id="admin-pages-menu">
                      <div className="admin-nav-drop-inner" role="group" aria-label="Website pages">
                        {item.children.map((page) => (
                          <button
                            key={page.id}
                            type="button"
                            className={section === "pages" && pageTab === page.id ? "active" : ""}
                            onClick={() => pickPage(page.id)}
                          >
                            <span>{page.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    key={item.id}
                    type="button"
                    className={section === item.id ? "active" : ""}
                    onClick={() => pickSection(item.id)}
                  >
                    <AdminNavIcon name={item.icon} />
                    <span>{item.label}</span>
                  </button>
                )
              )}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-foot">
          <Link to="/" target="_blank" rel="noreferrer" className="admin-foot-link">
            <ExternalLink size={16} aria-hidden />
            View live site
          </Link>
          <button type="button" className="admin-logout" onClick={logout}>
            <LogOut size={16} aria-hidden />
            Log out
          </button>
        </div>
      </aside>

      <div className="admin-workspace">
        <header className="admin-topbar">
          <div className="admin-topbar-start">
            <button
              type="button"
              className="admin-icon-btn admin-menu-toggle"
              aria-label="Open menu"
              aria-expanded={navOpen}
              onClick={() => {
                setPreviewOpen(false);
                setNavOpen(true);
              }}
            >
              <Menu size={22} aria-hidden />
            </button>
            <p className="admin-topbar-crumb">
              <span className="admin-topbar-eyebrow">{active.group}</span>
              <span className="admin-topbar-sep" aria-hidden>
                /
              </span>
              <strong className="admin-topbar-page">{active.label}</strong>
            </p>
          </div>
          <div className="admin-topbar-actions">
            <div className="admin-topbar-tools">
              {section === "dashboard" ? null : (
                <button
                  type="button"
                  className="admin-icon-btn admin-preview-toggle"
                  aria-label="Open live preview"
                  aria-expanded={previewOpen}
                  onClick={() => {
                    setNavOpen(false);
                    setPreviewOpen(true);
                  }}
                >
                  <Eye size={20} aria-hidden />
                  <span className="admin-btn-label">Preview</span>
                </button>
              )}
              <button
                type="button"
                className="admin-topbar-seo"
                onClick={autoSeo}
                title="One-click SEO for entire site"
              >
                <Sparkles size={16} aria-hidden />
                <span className="admin-btn-label">Auto SEO</span>
              </button>
            </div>
            <button type="button" className="admin-topbar-publish" onClick={() => save()} disabled={saving}>
              {saving ? "Publishing…" : "Publish"}
            </button>
          </div>
        </header>
        <main className="admin-main">
          <AdminDashboard />
        </main>
      </div>
      {section === "dashboard" ? null : (
        <div className="admin-preview-wrap">
          <AdminPreviewRail onClose={() => setPreviewOpen(false)} />
        </div>
      )}
    </div>
    </>
  );
}

export default function AdminLayout() {
  const token = typeof localStorage === "undefined" ? null : localStorage.getItem(AUTH_KEY);
  if (!token) return <Navigate to="/admin/login" replace />;

  return (
    <AdminEditorProvider>
      <AdminChrome />
    </AdminEditorProvider>
  );
}
