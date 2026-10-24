import { AlertCircle, Loader2, RefreshCw, ServerCrash } from "lucide-react";
import Btn from "../components/ui/Btn.jsx";

export function AdminLoadingPanel() {
  return (
    <div className="admin-state-panel">
      <div className="admin-state-card">
        <Loader2 className="admin-state-icon spin" size={40} aria-hidden />
        <h2>Loading content</h2>
        <p>Fetching your CMS data from the API…</p>
      </div>
    </div>
  );
}

export function AdminErrorPanel({ message, onRetry }) {
  const isOffline = /cannot reach|port 5000/i.test(message || "");

  return (
    <div className="admin-state-panel">
      <div className="admin-state-card admin-state-card--error">
        {isOffline ? <ServerCrash className="admin-state-icon" size={40} aria-hidden /> : null}
        {!isOffline ? <AlertCircle className="admin-state-icon" size={40} aria-hidden /> : null}
        <h2>{isOffline ? "Backend not running" : "Could not load CMS"}</h2>
        <p>{message}</p>
        {isOffline ? (
          <pre className="admin-state-code">
            cd backend{"\n"}npm run dev
          </pre>
        ) : null}
        <div className="admin-state-actions">
          <Btn type="button" onClick={onRetry} icon={RefreshCw}>
            Try again
          </Btn>
        </div>
      </div>
    </div>
  );
}
