import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function AdminSubTabs({ tabs, active, onChange }) {
  return (
    <div className="admin-subtabs" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active === tab.id}
          className={active === tab.id ? "active" : ""}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function AdminAccordion({ title, summary, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className={`admin-card admin-accordion ${open ? "is-open" : ""}`}>
      <button type="button" className="admin-accordion-head" onClick={() => setOpen(!open)}>
        <div>
          <h2>{title}</h2>
          {summary ? <p className="admin-accordion-summary">{summary}</p> : null}
        </div>
        <ChevronDown size={18} className="admin-accordion-chevron" aria-hidden />
      </button>
      {open ? <div className="admin-accordion-body">{children}</div> : null}
    </section>
  );
}
