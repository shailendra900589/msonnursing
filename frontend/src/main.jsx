import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ContentProvider } from "./context/ContentContext.jsx";
import App from "./App.jsx";
import "./index.css";
import "./styles/animations.css";

if (import.meta.env.DEV && "serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      registration.unregister();
    });
  });
}

function readInitialContent() {
  if (window.__SSR_DATA__) return window.__SSR_DATA__;
  const node = document.getElementById("ssr-data");
  if (!node?.textContent) return null;
  try {
    return JSON.parse(node.textContent);
  } catch {
    return null;
  }
}

const initialContent = readInitialContent();
const tree = (
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <ContentProvider initialContent={initialContent}>
          <App />
        </ContentProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);

const rootEl = document.getElementById("root");
if (initialContent && rootEl.childNodes.length) hydrateRoot(rootEl, tree);
else createRoot(rootEl).render(tree);
