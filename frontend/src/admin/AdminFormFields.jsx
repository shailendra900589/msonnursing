import ImageUploadField from "./ImageUploadField.jsx";
import { Field } from "./BlockEditors.jsx";
import { isImageField, uploadFolderForField } from "./contentHelpers.js";

export function humanFieldLabel(field) {
  return field
    .replace(/Url$/i, " URL")
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
}

const LONG_KEYS = /description|intro|subtitle|summary|message|quote|text|embed|commitment|vision|ctaText|eventsSubtitle|testimonialsSubtitle|whySubtitle|processSubtitle/i;
const NUMBER_KEYS = /count|established|featuredCount|homeEventsCount|baseFontSize|headingScale|headingWeight|bodyWeight/i;
const COLOR_KEYS = /color/i;

function fieldKind(field, val, pathPrefix) {
  if (pathPrefix.includes("theme.colors") || COLOR_KEYS.test(field)) return "color";
  if (typeof val === "boolean") return "boolean";
  if (typeof val === "number" || NUMBER_KEYS.test(field)) return "number";
  if (typeof val === "string" && (LONG_KEYS.test(field) || val.length > 72)) return "long";
  if (field.startsWith("show") || field.startsWith("has") || field.startsWith("published")) return "boolean";
  return "text";
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="admin-toggle">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="admin-toggle-ui" aria-hidden />
      <span>{label}</span>
    </label>
  );
}

export function SmartObjectFields({ data, pathPrefix, onChange, skip = [], token, columns = 2 }) {
  const obj = pathPrefix.split(".").reduce((a, k) => a?.[k], data);
  if (!obj || typeof obj !== "object") return null;

  const gridClass = columns === 1 ? "admin-grid admin-grid-1" : "admin-grid admin-grid-dense";

  return (
    <div className={gridClass}>
      {Object.entries(obj).map(([field, val]) => {
        if (skip.includes(field)) return null;
        if (Array.isArray(val) || (val && typeof val === "object")) return null;
        const path = `${pathPrefix}.${field}`;
        const label = humanFieldLabel(field);
        const kind = fieldKind(field, val, pathPrefix);

        if (token && isImageField(field)) {
          return (
            <ImageUploadField
              key={path}
              className="admin-field-span-2"
              label={label}
              hint="Upload — stored on backend"
              value={val ?? ""}
              folder={uploadFolderForField(field, pathPrefix)}
              token={token}
              onChange={(url) => onChange(path, url)}
            />
          );
        }

        if (kind === "boolean") {
          const checked = val === true || val === "true";
          return (
            <div key={path} className="admin-field admin-field-compact">
              <Toggle checked={checked} onChange={(v) => onChange(path, v)} label={label} />
            </div>
          );
        }

        if (kind === "color") {
          return (
            <Field key={path} label={label} className="admin-field-compact">
              <div className="admin-color-row">
                <input
                  type="color"
                  value={String(val || "#000000").slice(0, 7)}
                  onChange={(e) => onChange(path, e.target.value)}
                />
                <input value={val ?? ""} onChange={(e) => onChange(path, e.target.value)} />
              </div>
            </Field>
          );
        }

        if (kind === "number") {
          return (
            <Field key={path} label={label} className="admin-field-compact">
              <input
                type="number"
                className="admin-input-narrow"
                value={val ?? ""}
                onChange={(e) => onChange(path, e.target.value === "" ? "" : Number(e.target.value))}
              />
            </Field>
          );
        }

        if (kind === "long") {
          return (
            <Field key={path} label={label} className="admin-field-span-2">
              <textarea rows={3} value={val ?? ""} onChange={(e) => onChange(path, e.target.value)} />
            </Field>
          );
        }

        return (
          <Field key={path} label={label} className="admin-field-compact">
            <input value={val ?? ""} onChange={(e) => onChange(path, e.target.value)} />
          </Field>
        );
      })}
    </div>
  );
}
