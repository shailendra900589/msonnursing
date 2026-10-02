import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Download, Inbox, Phone, RefreshCw, Search } from "lucide-react";
import { adminFetchEnquiries } from "../api/client.js";
import { downloadEnquiriesCsv } from "./exportEnquiriesCsv.js";
import { useAdminEditor } from "./AdminEditorContext.jsx";
import ResumeActions from "./ResumeActions.jsx";

const PAGE_SIZE = 15;
const PREVIEW_LENGTH = 180;

function formatWhen(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function sourceLabel(row) {
  if (row.jobTitle) return `Job · ${row.jobTitle}`;
  if (row.eventTitle) return `Event · ${row.eventTitle}`;
  if (row.serviceTitle) return `Service · ${row.serviceTitle}`;
  if (row.sourcePage) return row.sourcePage;
  return "Website form";
}

function pageItems(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const items = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) items.push("gap-start");
  for (let i = start; i <= end; i += 1) items.push(i);
  if (end < total - 1) items.push("gap-end");
  items.push(total);
  return items;
}

export default function AdminLeadsPanel() {
  const { token } = useAdminEditor();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [source, setSource] = useState("all");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState("");
  const [exportHint, setExportHint] = useState("");

  const load = () => {
    setLoading(true);
    setError("");
    return adminFetchEnquiries(token)
      .then((list) => setRows(Array.isArray(list) ? list : []))
      .catch(() => setError("Could not load leads. Check that the API is running."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [token]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = [...rows].sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
    return sorted.filter((row) => {
      if (source === "jobs" && !row.jobId && !row.jobTitle) return false;
      if (source === "events" && !row.eventId && !row.eventTitle) return false;
      if (source === "contact" && (row.jobId || row.jobTitle || row.eventId || row.eventTitle)) return false;
      if (!q) return true;
      return [row.name, row.phone, row.message, row.jobTitle, row.eventTitle, row.serviceTitle, row.sourcePage, row.resumeName]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [rows, query, source]);

  const counts = useMemo(
    () => ({
      all: rows.length,
      jobs: rows.filter((row) => row.jobId || row.jobTitle).length,
      events: rows.filter((row) => row.eventId || row.eventTitle).length,
      contact: rows.filter((row) => !(row.jobId || row.jobTitle || row.eventId || row.eventTitle)).length,
    }),
    [rows]
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);
  const showPagination = filtered.length > PAGE_SIZE;

  const onExport = () => {
    if (!filtered.length) {
      setExportHint("No leads to export.");
      return;
    }
    const ok = downloadEnquiriesCsv(filtered, "mson-leads.csv");
    setExportHint(ok ? `Downloaded ${filtered.length} lead${filtered.length === 1 ? "" : "s"}.` : "Export failed.");
  };

  const filters = [
    ["all", "All", counts.all],
    ["jobs", "Job applications", counts.jobs],
    ["events", "Events", counts.events],
    ["contact", "Contact & services", counts.contact],
  ];

  return (
    <section className="admin-leads" aria-label="Leads">
      <header className="admin-leads-head">
        <div className="admin-leads-title">
          <div>
            <h2>Leads</h2>
            <p>{loading ? "Loading submissions…" : `${filtered.length} submitted form${filtered.length === 1 ? "" : "s"} · newest first`}</p>
          </div>
          <div className="admin-head-actions">
            <button type="button" className="admin-mini-btn" onClick={load} disabled={loading}>
              <RefreshCw size={14} aria-hidden /> {loading ? "Loading" : "Refresh"}
            </button>
            <button type="button" className="admin-mini-btn admin-mini-btn-primary" onClick={onExport}>
              <Download size={14} aria-hidden /> Export
            </button>
          </div>
        </div>
      </header>

      <div className="admin-leads-toolbar">
        <div className="admin-lead-filters" role="tablist" aria-label="Enquiry type">
          {filters.map(([id, label, count]) => (
            <button
              key={id}
              type="button"
              className={source === id ? "is-active" : ""}
              onClick={() => {
                setSource(id);
                setPage(1);
              }}
            >
              {label}
              <em>{loading ? "…" : count}</em>
            </button>
          ))}
        </div>
        <label className="admin-dash-search admin-leads-search">
          <Search size={16} aria-hidden />
          <input
            type="search"
            value={query}
            placeholder="Search name, phone, or message"
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
              setExportHint("");
            }}
          />
        </label>
      </div>
      {exportHint ? <p className="admin-form-note">{exportHint}</p> : null}
      {error ? <p className="admin-form-note admin-form-note--error">{error}</p> : null}

      {!loading && !error && !visible.length ? (
        <div className="admin-leads-empty">
          <Inbox size={28} aria-hidden />
          <h3>{query.trim() ? "No matching leads" : "No leads yet"}</h3>
          <p>
            {query.trim()
              ? "Try another name, phone number, or message."
              : "Contact, service, event, and job applications will appear here. Job resumes can be viewed and downloaded."}
          </p>
        </div>
      ) : (
        <ul className="admin-leads-list">
          {visible.map((row) => {
            const message = String(row.message || "");
            const expanded = openId === row.id;
            const canFold = message.length > PREVIEW_LENGTH;
            const preview = canFold && !expanded ? `${message.slice(0, PREVIEW_LENGTH).trim()}…` : message;
            const initial = String(row.name || "V").trim().charAt(0).toUpperCase();
            return (
              <li key={row.id}>
                <article className={`admin-lead-card ${expanded ? "is-open" : ""}`}>
                  <div className="admin-lead-avatar" aria-hidden>
                    {initial}
                  </div>
                  <div className="admin-lead-body">
                    <header>
                      <div>
                        <strong>{row.name || "Visitor"}</strong>
                        <span className="admin-kind-pill">{sourceLabel(row)}</span>
                      </div>
                      <time dateTime={row.createdAt}>{formatWhen(row.createdAt)}</time>
                    </header>
                    {row.phone ? (
                      <a className="admin-lead-phone" href={`tel:${row.phone}`}>
                        <Phone size={14} aria-hidden /> {row.phone}
                      </a>
                    ) : null}
                    {preview ? <p>{preview}</p> : null}
                    {expanded ? (
                      <dl className="admin-lead-details">
                        {row.sourcePath ? (
                          <div>
                            <dt>Page</dt>
                            <dd>{row.sourcePath}</dd>
                          </div>
                        ) : null}
                        {row.formResponses &&
                          Object.entries(row.formResponses).map(([key, val]) => (
                            <div key={key}>
                              <dt>{key}</dt>
                              <dd>{val}</dd>
                            </div>
                          ))}
                      </dl>
                    ) : null}
                    <footer className="admin-lead-foot">
                      <ResumeActions token={token} row={row} />
                      {canFold || (row.formResponses && Object.keys(row.formResponses).length) ? (
                        <button type="button" className="admin-text-btn" onClick={() => setOpenId(expanded ? "" : row.id)}>
                          {expanded ? "Show less" : "Read more"}
                        </button>
                      ) : null}
                    </footer>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}

      {showPagination ? (
        <nav className="admin-inbox-pager admin-leads-pager" aria-label="Lead pages">
          <button type="button" className="admin-inbox-page" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}>
            <ChevronLeft size={16} aria-hidden /> Prev
          </button>
          <div className="admin-inbox-pages">
            {pageItems(currentPage, pageCount).map((item) =>
              typeof item === "string" ? (
                <span key={item} className="admin-inbox-gap">
                  …
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  className={item === currentPage ? "admin-inbox-page is-active" : "admin-inbox-page"}
                  onClick={() => setPage(item)}
                  aria-current={item === currentPage ? "page" : undefined}
                >
                  {item}
                </button>
              )
            )}
          </div>
          <button
            type="button"
            className="admin-inbox-page"
            disabled={currentPage >= pageCount}
            onClick={() => setPage(currentPage + 1)}
          >
            Next <ChevronRight size={16} aria-hidden />
          </button>
          <p>
            {start + 1}–{Math.min(start + PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
        </nav>
      ) : null}
    </section>
  );
}
