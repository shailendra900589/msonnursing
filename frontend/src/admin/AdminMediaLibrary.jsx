import { useEffect, useState } from "react";
import { adminDeleteMedia, adminListMedia } from "../api/client.js";
import { mediaUrl } from "../utils/mediaUrl.js";

export default function AdminMediaLibrary({ token, onPickUrl }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const load = () => {
    setLoading(true);
    adminListMedia(token)
      .then(setItems)
      .catch(() => setMessage("Could not load media library"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [token]);

  const remove = async (item) => {
    if (!window.confirm(`Delete ${item.filename}?`)) return;
    try {
      await adminDeleteMedia(token, item.folder, item.filename);
      load();
      setMessage("File deleted.");
    } catch {
      setMessage("Delete failed.");
    }
  };

  if (loading) return <p>Loading media…</p>;

  return (
    <section className="admin-card">
      <div className="admin-card-head">
        <h2>Media library (backend uploads)</h2>
        <button type="button" className="admin-mini-btn" onClick={load}>
          Refresh
        </button>
      </div>
      {message ? <p className="admin-hint">{message}</p> : null}
      {items.length === 0 ? (
        <p className="admin-hint">No uploads yet. Use image fields to upload files.</p>
      ) : (
        <div className="media-grid">
          {items.map((item) => (
            <article key={`${item.folder}-${item.filename}`} className="media-item">
              <img src={mediaUrl(item.url)} alt={item.filename || "Uploaded media file"} />
              <code>{item.url}</code>
              <div className="upload-actions">
                {onPickUrl ? (
                  <button type="button" className="admin-mini-btn" onClick={() => onPickUrl(item.url)}>
                    Use URL
                  </button>
                ) : null}
                <button type="button" className="admin-danger" onClick={() => remove(item)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
