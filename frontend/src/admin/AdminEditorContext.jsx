import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminFetchContent, adminSaveContent, AUTH_KEY, ApiError } from "../api/client.js";
import { useContent } from "../context/ContentContext.jsx";
import { setByPath } from "./contentHelpers.js";
import { diffContent } from "./contentDiff.js";
import { syncPreviewContent } from "./previewSync.js";

const AdminEditorContext = createContext(null);

export function AdminEditorProvider({ children }) {
  const navigate = useNavigate();
  const { reload } = useContent();
  const token = typeof localStorage === "undefined" ? null : localStorage.getItem(AUTH_KEY);
  const [section, setSection] = useState("dashboard");
  const [pageTab, setPageTab] = useState("home");
  const [data, setData] = useState(null);
  const [baseline, setBaseline] = useState(null);
  const [jsonText, setJsonText] = useState("");
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [previewVersion, setPreviewVersion] = useState(0);
  const [leadsOpen, setLeadsOpen] = useState(false);

  const loadContent = useCallback(async () => {
    if (!token) {
      navigate("/admin/login", { replace: true });
      return;
    }
    setLoading(true);
    setLoadError("");
    setStatus("");
    setStatusType("");
    try {
      const c = await adminFetchContent(token);
      setData(c);
      setBaseline(structuredClone(c));
      setJsonText(JSON.stringify(c, null, 2));
      syncPreviewContent(c);
      setPreviewVersion((v) => v + 1);
    } catch (err) {
      const apiErr = err instanceof ApiError ? err : new ApiError("Failed to load CMS data", 0);
      if (apiErr.status === 401) {
        localStorage.removeItem(AUTH_KEY);
        navigate("/admin/login?expired=1", { replace: true });
        return;
      }
      const message =
        apiErr.status === 0 ? apiErr.message : `${apiErr.message} (${apiErr.status})`;
      setLoadError(message);
      setStatus(message);
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  useEffect(() => {
    if (!data) return;
    syncPreviewContent(data);
    setPreviewVersion((v) => v + 1);
  }, [data]);

  const pushPreview = useCallback(
    (targetWindow) => {
      if (!data) return;
      syncPreviewContent(data);
      if (targetWindow) {
        targetWindow.postMessage({ type: "MSON_CMS_PREVIEW", content: data }, window.location.origin);
      }
    },
    [data]
  );

  const update = (path, value, replaceAll = null) => {
    if (replaceAll) {
      setData(replaceAll);
      setJsonText(JSON.stringify(replaceAll, null, 2));
      return;
    }
    setData((prev) => {
      const next = structuredClone(prev);
      setByPath(next, path, value);
      setJsonText(JSON.stringify(next, null, 2));
      return next;
    });
  };

  const save = async (payload = data) => {
    setSaving(true);
    setStatus("");
    setStatusType("");
    try {
      await adminSaveContent(token, payload);
      await reload();
      setBaseline(structuredClone(payload));
      setStatus("Published — live site updated.");
      setStatusType("success");
    } catch (err) {
      const apiErr = err instanceof ApiError ? err : new ApiError("Save failed", 0);
      if (apiErr.status === 401) {
        localStorage.removeItem(AUTH_KEY);
        navigate("/admin/login?expired=1", { replace: true });
        return;
      }
      setStatus(apiErr.message || "Save failed. Check API session.");
      setStatusType("error");
    } finally {
      setSaving(false);
    }
  };

  const changes = useMemo(() => diffContent(baseline, data), [baseline, data]);

  const value = useMemo(
    () => ({
      token,
      section,
      setSection,
      pageTab,
      setPageTab,
      data,
      update,
      save,
      saving,
      status,
      statusType,
      setStatus,
      setStatusType,
      jsonText,
      setJsonText,
      loading,
      loadError,
      reloadContent: loadContent,
      changes,
      pushPreview,
      previewVersion,
      leadsOpen,
      setLeadsOpen,
    }),
    [
      token,
      section,
      pageTab,
      data,
      saving,
      status,
      statusType,
      jsonText,
      loading,
      loadError,
      loadContent,
      changes,
      pushPreview,
      previewVersion,
      leadsOpen,
    ]
  );

  return <AdminEditorContext.Provider value={value}>{children}</AdminEditorContext.Provider>;
}

export function useAdminEditor() {
  const ctx = useContext(AdminEditorContext);
  if (!ctx) throw new Error("useAdminEditor must be used within AdminEditorProvider");
  return ctx;
}
