import { useId, useState } from "react";
import { adminUploadFile } from "../api/client.js";
import { mediaUrl } from "../utils/mediaUrl.js";

export default function ImageUploadField({
  label,
  hint,
  value,
  onChange,
  folder,
  token,
  className = "",
}) {
  const inputId = useId();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const onPick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const result = await adminUploadFile(token, file, folder);
      onChange(result.url);
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <label className={`admin-field admin-upload ${className}`.trim()}>
      <span>{label}</span>
      {hint ? <small className="admin-hint">{hint}</small> : null}
      <div className="upload-box">
        {value ? (
          <img src={mediaUrl(value)} alt="Uploaded image preview" className="upload-preview" />
        ) : (
          <div className="upload-placeholder">No image uploaded</div>
        )}
        <div className="upload-actions">
          <label htmlFor={inputId} className="admin-mini-btn upload-btn">
            {uploading ? "Uploading…" : "Upload from computer"}
          </label>
          <input
            id={inputId}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            className="upload-input-hidden"
            onChange={onPick}
            disabled={uploading}
          />
          {value ? (
            <button type="button" className="admin-danger" onClick={() => onChange("")}>
              Remove
            </button>
          ) : null}
        </div>
        {value ? <code className="upload-path">{value}</code> : null}
        {error ? <p className="admin-error">{error}</p> : null}
      </div>
    </label>
  );
}
