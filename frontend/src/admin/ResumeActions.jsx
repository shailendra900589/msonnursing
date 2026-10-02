import { useEffect, useState } from "react";
import { Download, Eye, X } from "lucide-react";
import { adminFetchResumeBlob, saveResumeFile } from "../api/client.js";

export default function ResumeActions({ token, row }) {
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);
  const isJob = Boolean(row?.jobId || row?.jobTitle);

  useEffect(() => {
    return () => {
      if (preview?.url) URL.revokeObjectURL(preview.url);
    };
  }, [preview]);

  if (!isJob && !row?.resumeFile) return null;

  const closePreview = () => setPreview(null);

  const open = async (mode) => {
    if (!row?.resumeFile) return;
    setBusy(mode);
    setError("");
    try {
      const blob = await adminFetchResumeBlob(token, row.id, mode === "download");
      const filename = row.resumeName || "resume";
      if (mode === "download") {
        saveResumeFile(blob, filename);
        return;
      }
      const isPdf = blob.type.includes("pdf") || filename.toLowerCase().endsWith(".pdf");
      if (!isPdf) {
        saveResumeFile(blob, filename);
        setError("Word resumes download to your computer. PDF resumes open here.");
        return;
      }
      const url = URL.createObjectURL(blob);
      setPreview({ url, name: filename });
    } catch (err) {
      setError(err.message || "Could not open resume");
    } finally {
      setBusy("");
    }
  };

  if (!row?.resumeFile) {
    return <p className="admin-resume-missing">No resume attached</p>;
  }

  return (
    <>
      <div className="admin-resume-actions">
        <span>{row.resumeName || "Resume"}</span>
        <button type="button" className="admin-mini-btn" onClick={() => open("view")} disabled={Boolean(busy)}>
          <Eye size={14} aria-hidden /> {busy === "view" ? "Opening…" : "View"}
        </button>
        <button type="button" className="admin-mini-btn admin-mini-btn-primary" onClick={() => open("download")} disabled={Boolean(busy)}>
          <Download size={14} aria-hidden /> {busy === "download" ? "Saving…" : "Download"}
        </button>
        {error ? <p className="admin-resume-error">{error}</p> : null}
      </div>
      {preview ? (
        <div className="admin-resume-modal" role="dialog" aria-modal="true" aria-label={`Resume ${preview.name}`}>
          <div className="admin-resume-modal-card">
            <header>
              <strong>{preview.name}</strong>
              <button type="button" className="admin-mini-btn" onClick={closePreview}>
                <X size={14} aria-hidden /> Close
              </button>
            </header>
            <iframe title={preview.name} src={preview.url} />
          </div>
        </div>
      ) : null}
    </>
  );
}
