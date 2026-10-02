import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchContent, getLastContentSource } from "../api/client.js";

const ContentContext = createContext(null);

export function StaticContentProvider({ content, children }) {
  const value = useMemo(
    () => ({
      content,
      error: null,
      loading: !content,
      reload: async () => {},
      setContent: () => {},
    }),
    [content]
  );
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function ContentProvider({ children, initialContent = null }) {
  const [content, setContent] = useState(initialContent);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(!initialContent);
  const [contentSource, setContentSource] = useState("api");

  const reload = () => {
    setLoading(true);
    setError(null);
    return fetchContent()
      .then((data) => {
        setContent(data);
        setContentSource(getLastContentSource());
        setError(null);
      })
      .catch((err) => {
        setContent((prev) => {
          if (!prev) setError(err.message || "Failed to load content");
          return prev;
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      if (!initialContent) {
        setLoading(true);
        setError(null);
      }

      if (import.meta.env.DEV) {
        try {
          const mod = await import("../dev/contentSnapshot.js");
          const snap = mod.default ?? mod;
          if (!cancelled && snap?.site && Array.isArray(snap.services)) {
            setContent((prev) => prev || snap);
            setLoading(false);
          }
        } catch {
          /* bundled snapshot optional */
        }
      }

      try {
        const data = await fetchContent();
        if (!cancelled) {
          setContent(data);
          setContentSource(getLastContentSource());
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setContentSource("fallback");
          setContent((prev) => {
            if (!prev) setError(err.message || "Failed to load content");
            return prev;
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({ content, error, loading, reload, setContent, contentSource }),
    [content, error, loading, contentSource]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
}
