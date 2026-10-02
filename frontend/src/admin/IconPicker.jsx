import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import MedicalIcon from "../components/MedicalIcon.jsx";
import { ICON_OPTIONS, iconLabel } from "./contentHelpers.js";
import "./IconPicker.css";

export default function IconPicker({ value, onChange, label = "Medical icon" }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const listId = useId();
  const current = value || ICON_OPTIONS[0];

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="admin-field admin-field-compact admin-icon-picker" ref={rootRef}>
      <span id={`${listId}-label`}>{label}</span>
      <button
        type="button"
        className="admin-icon-picker-trigger"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-labelledby={`${listId}-label`}
        onClick={() => setOpen(!open)}
      >
        <MedicalIcon name={current} size={18} />
        <span className="admin-icon-picker-value">{iconLabel(current)}</span>
        <ChevronDown size={16} className={`admin-icon-picker-chevron ${open ? "open" : ""}`} aria-hidden />
      </button>
      {open ? (
        <ul className="admin-icon-picker-menu" role="listbox" aria-labelledby={`${listId}-label`}>
          {ICON_OPTIONS.map((ic) => {
            const selected = ic === current;
            return (
              <li key={ic} role="option" aria-selected={selected}>
                <button
                  type="button"
                  className={selected ? "active" : ""}
                  onClick={() => {
                    onChange(ic);
                    setOpen(false);
                  }}
                >
                  <MedicalIcon name={ic} size={17} />
                  <span>{iconLabel(ic)}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
