import { useEffect, useMemo, useState } from "react";
import { Download } from "lucide-react";
import { adminFetchEnquiries } from "../api/client.js";
import { downloadEnquiriesCsv, filterEnquiries } from "./exportEnquiriesCsv.js";
import ResumeActions from "./ResumeActions.jsx";

function monthInputValue(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export default function AdminEnquiriesPanel({ token, events = [] }) {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [eventFilter, setEventFilter] = useState("");
  const [periodMode, setPeriodMode] = useState("all");
  const [filterMonth, setFilterMonth] = useState(monthInputValue());
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [exportHint, setExportHint] = useState("");

  const load = () => {
    adminFetchEnquiries(token)
      .then(setRows)
      .catch(() => setError("Could not load enquiries. Is the API running?"));
  };

  useEffect(() => {
    load();
  }, [token]);

  const filtered = useMemo(
    () =>
      filterEnquiries(rows, {
        eventFilter,
        periodMode,
        month: filterMonth,
        dateFrom,
        dateTo,
      }),
    [rows, eventFilter, periodMode, filterMonth, dateFrom, dateTo]
  );

  const onExport = () => {
    if (!filtered.length) {
      setExportHint("No rows match the current filters.");
      return;
    }
    const parts = ["enquiries"];
    if (eventFilter && eventFilter !== "__events__" && eventFilter !== "__contact__") {
      parts.push(eventFilter);
    } else if (eventFilter === "__contact__") parts.push("contact-only");
    else if (eventFilter === "__events__") parts.push("all-events");
    if (periodMode === "month") parts.push(filterMonth);
    if (periodMode === "range" && dateFrom) parts.push(`from-${dateFrom}`);
    if (periodMode === "range" && dateTo) parts.push(`to-${dateTo}`);
    const ok = downloadEnquiriesCsv(filtered, `${parts.join("_")}.csv`);
    setExportHint(ok ? `Downloaded ${filtered.length} row(s) as Excel-compatible CSV.` : "Export failed.");
  };

  return (
    <div className="admin-stack admin-stack-tight">
      <div className="admin-card admin-card-head-row">
        <h2>Enquiries & event registrations</h2>
        <div className="admin-head-actions">
          <button type="button" className="admin-mini-btn" onClick={load}>
            Refresh
          </button>
          <button type="button" className="admin-mini-btn admin-mini-btn-primary" onClick={onExport}>
            <Download size={14} aria-hidden /> Export Excel (CSV)
          </button>
        </div>
      </div>

      <div className="admin-card admin-enquiry-filters">
        <div className="admin-grid admin-grid-dense">
          <label>
            <span className="admin-label">Filter by source</span>
            <select value={eventFilter} onChange={(e) => setEventFilter(e.target.value)}>
              <option value="">All enquiries</option>
              <option value="__events__">All event registrations</option>
              <option value="__jobs__">Job applications</option>
              <option value="__contact__">Contact / services</option>
              <optgroup label="Specific event">
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title}
                  </option>
                ))}
              </optgroup>
            </select>
          </label>
          <label>
            <span className="admin-label">Date filter</span>
            <select value={periodMode} onChange={(e) => setPeriodMode(e.target.value)}>
              <option value="all">All dates</option>
              <option value="month">By month</option>
              <option value="range">Custom date range</option>
            </select>
          </label>
          {periodMode === "month" ? (
            <label>
              <span className="admin-label">Month</span>
              <input type="month" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} />
            </label>
          ) : null}
          {periodMode === "range" ? (
            <>
              <label>
                <span className="admin-label">From</span>
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
              </label>
              <label>
                <span className="admin-label">To</span>
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
              </label>
            </>
          ) : null}
        </div>
        <p className="admin-hint admin-hint-inline">
          Showing <strong>{filtered.length}</strong> of {rows.length} total · CSV opens in Microsoft Excel with UTF-8
          encoding.
        </p>
        {exportHint ? <p className="admin-hint">{exportHint}</p> : null}
      </div>

      {error ? <p className="admin-error">{error}</p> : null}
      {filtered.length === 0 && !error ? (
        <p className="admin-hint">No enquiries match these filters yet.</p>
      ) : null}
      {filtered.map((row) => (
        <article key={row.id} className="admin-card admin-enquiry-row">
          <header>
            <strong>{row.name}</strong>
            <time dateTime={row.createdAt}>{new Date(row.createdAt).toLocaleString()}</time>
          </header>
          {row.phone ? <p>Phone: {row.phone}</p> : null}
          {row.eventTitle || row.eventId ? (
            <p>
              Event: <strong>{row.eventTitle || row.eventId}</strong>
              {row.eventId ? ` · ${row.eventId}` : ""}
              {row.formType ? ` · ${row.formType}` : ""}
            </p>
          ) : null}
          {row.sourcePage || row.sourcePath ? (
            <p className="admin-enquiry-source">
              From: <strong>{row.sourcePage || "Website"}</strong>
              {row.sourcePath ? ` (${row.sourcePath})` : ""}
            </p>
          ) : null}
          {row.jobTitle || row.jobId ? (
            <p>
              Job: <strong>{row.jobTitle || row.jobId}</strong>
              {row.jobId ? ` · ${row.jobId}` : ""}
            </p>
          ) : null}
          {row.serviceTitle ? (
            <p>
              Service: <strong>{row.serviceTitle}</strong>
              {row.serviceId ? ` · ${row.serviceId}` : ""}
            </p>
          ) : null}
          <p>{row.message}</p>
          <ResumeActions token={token} row={row} />
          {row.formResponses && Object.keys(row.formResponses).length ? (
            <dl className="admin-enquiry-responses">
              {Object.entries(row.formResponses).map(([key, val]) => (
                <div key={key}>
                  <dt>{key}</dt>
                  <dd>{val}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </article>
      ))}
    </div>
  );
}
