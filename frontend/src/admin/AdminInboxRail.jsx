import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Inbox, Search } from "lucide-react";
import { adminFetchEnquiries } from "../api/client.js";
import { useAdminEditor } from "./AdminEditorContext.jsx";

const PAGE_SIZE = 15;
const PREVIEW_LENGTH = 160;

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

export default function AdminInboxRail({ onOpen }) {
  const { token } = useAdminEditor();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState("");

  const load = () => {
    setLoading(true);
    setError("");
    return adminFetchEnquiries(token)
      .then((list) => setRows(Array.isArray(list) ? list : []))
      .catch(() => setError("Could not load submitted forms. Check that the API is running."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [token]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = [...rows].sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
    if (!q) return sorted;
    return sorted.filter((row) =>
      [row.name, row.phone, row.message, row.jobTitle, row.eventTitle, row.serviceTitle, row.sourcePage]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [rows, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);
  const showPagination = filtered.length > PAGE_SIZE;

  const onSearch = (value) => {
    setQuery(value);
    setPage(1);
  };

  return (
    <aside className="admin-inbox-rail" aria-label="Submitted forms">
      <header className="admin-inbox-head">
        <div>
          <p className="admin-dash-kicker">Inbox</p>
          <strong>Submitted forms</strong>
          <p>{loading ? "Loading…" : `${filtered.length} total · newest first`}</p>
        </div>
        <button type="button" className="admin-mini-btn admin-mini-btn-primary" onClick={onOpen}>
          Open leads
        </button>
      </header>

      <label className="admin-dash-search admin-inbox-search">
        <Search size={16} aria-hidden />
        <input
          type="search"
          value={query}
          placeholder="Search name, phone, or message"
          onChange={(e) => onSearch(e.target.value)}
        />
      </label>

      <div className="admin-inbox-scroll">
        {error ? <p className="admin-form-note admin-form-note--error">{error}</p> : null}
        {!loading && !error && !visible.length ? (
          <div className="admin-inbox-empty">
            <Inbox size={22} aria-hidden />
            <p>{query.trim() ? "No matching submissions." : "No form submissions yet."}</p>
          </div>
        ) : null}
        {visible.map((row) => {
          const message = String(row.message || "");
          const expanded = openId === row.id;
          const canFold = message.length > PREVIEW_LENGTH;
          const preview = canFold && !expanded ? `${message.slice(0, PREVIEW_LENGTH).trim()}…` : message;
          return (
            <article key={row.id} className="admin-inbox-card">
              <header>
                <strong>{row.name || "Visitor"}</strong>
                <time dateTime={row.createdAt}>{formatWhen(row.createdAt)}</time>
              </header>
              <p className="admin-inbox-meta">
                {sourceLabel(row)}
                {row.phone ? ` · ${row.phone}` : ""}
              </p>
              {preview ? <p className="admin-inbox-message">{preview}</p> : null}
              {expanded && row.formResponses && Object.keys(row.formResponses).length ? (
                <dl className="admin-inbox-extra">
                  {Object.entries(row.formResponses).map(([key, val]) => (
                    <div key={key}>
                      <dt>{key}</dt>
                      <dd>{val}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              {canFold ? (
                <button type="button" className="admin-text-btn" onClick={() => setOpenId(expanded ? "" : row.id)}>
                  {expanded ? "Show less" : "Read more"}
                </button>
              ) : null}
            </article>
          );
        })}
      </div>

      {showPagination ? (
        <nav className="admin-inbox-pager" aria-label="Form pages">
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
    </aside>
  );
}
