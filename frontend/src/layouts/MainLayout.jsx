import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import ScrollToTop from "../components/ScrollToTop.jsx";
import FloatingCareBar from "../components/FloatingCareBar.jsx";
import ThemeApplier from "../components/ThemeApplier.jsx";
import VendorSiteMeta from "../components/VendorSiteMeta.jsx";
import RouteErrorBoundary from "../components/RouteErrorBoundary.jsx";
import { useContent } from "../context/ContentContext.jsx";

function LoadingShell() {
  return (
    <div className="container page-loading">
      <div className="skeleton skeleton-bar" />
      <div className="skeleton skeleton-hero" />
    </div>
  );
}

export default function MainLayout({ previewMode = false }) {
  const { content, error, loading, reload, contentSource } = useContent();
  const location = useLocation();
  const embedPreview = previewMode && new URLSearchParams(location.search).get("embed") === "1";

  if (error && !content) {
    return (
      <div className="container error-shell">
        <h1>Unable to load website</h1>
        <p>
          Start both servers from the project root:{" "}
          <code className="error-shell-code">npm run dev</code> — or only backend:{" "}
          <code className="error-shell-code">cd backend; npm run dev</code> (port 5000), then try
          again.
        </p>
        <p className="error-shell-detail">{error}</p>
        <button type="button" className="btn btn-primary error-shell-retry" onClick={() => reload()}>
          Try again
        </button>
      </div>
    );
  }

  if (loading || !content) return <LoadingShell />;

  return (
    <>
      <ThemeApplier theme={content.site?.theme} />
      <VendorSiteMeta site={content.site} />
      {previewMode && !embedPreview ? (
        <div className="preview-banner" role="status">
          Live CMS preview — changes appear automatically (no refresh)
        </div>
      ) : null}
      {contentSource === "fallback" ? (
        <div className="dev-api-banner" role="status">
          {import.meta.env.DEV
            ? "Offline snapshot — start backend for live CMS:"
            : "Showing saved content — live API is unavailable."}{" "}
          {import.meta.env.DEV ? (
            <>
              <code>npm run dev</code> from project root (port 5000).
            </>
          ) : null}
          <button type="button" className="dev-api-banner-retry" onClick={() => reload()}>
            Retry API
          </button>
        </div>
      ) : null}
      <ScrollToTop />
      <Header content={content} />
      <main key={location.pathname} className={`page-enter ${previewMode ? "preview-mode" : ""}`}>
        <RouteErrorBoundary>
          <Outlet context={{ content }} />
        </RouteErrorBoundary>
      </main>
      <Footer content={content} />
      {!previewMode ? <FloatingCareBar /> : null}
    </>
  );
}
