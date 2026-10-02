import { SmartObjectFields } from "./AdminFormFields.jsx";
import { AdminAccordion } from "./AdminUi.jsx";

const FONT_OPTIONS = [
  "DM Sans, system-ui, sans-serif",
  "Inter, system-ui, sans-serif",
  "Segoe UI, system-ui, sans-serif",
  "Georgia, serif",
  "Merriweather, Georgia, serif",
];

export default function AdminAppearanceEditor({ data, update }) {
  const theme = data.site?.theme || {};

  return (
    <div className="admin-stack admin-stack-tight">
      <AdminAccordion title="Brand colors" summary="Background, text, primary blue & accent red — live on all pages">
        <SmartObjectFields data={data} pathPrefix="site.theme.colors" onChange={update} columns={2} />
      </AdminAccordion>
      <AdminAccordion title="Typography" summary="Base size, headings weight & font family">
        <SmartObjectFields data={data} pathPrefix="site.theme.typography" onChange={update} columns={2} />
        <label className="admin-field admin-field-compact">
          <span>Font family</span>
          <select
            value={theme.typography?.fontFamily || FONT_OPTIONS[0]}
            onChange={(e) => update("site.theme.typography.fontFamily", e.target.value)}
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f} value={f}>
                {f.split(",")[0]}
              </option>
            ))}
          </select>
        </label>
      </AdminAccordion>
    </div>
  );
}
