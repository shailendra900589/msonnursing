import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { StaticContentProvider } from "./context/ContentContext.jsx";
import App from "./App.jsx";
import "./index.css";
import "./styles/animations.css";

export function render(url, content, siteUrl) {
  const pageContent = siteUrl
    ? { ...content, site: { ...content.site, url: String(siteUrl).replace(/\/$/, "") } }
    : content;
  const helmetContext = {};
  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <MemoryRouter initialEntries={[url]}>
        <StaticContentProvider content={pageContent}>
          <App />
        </StaticContentProvider>
      </MemoryRouter>
    </HelmetProvider>
  );
  const { helmet } = helmetContext;
  const head = [helmet?.title, helmet?.meta, helmet?.link, helmet?.script]
    .map((part) => (part ? part.toString() : ""))
    .filter(Boolean)
    .join("\n");
  return { html, head };
}
