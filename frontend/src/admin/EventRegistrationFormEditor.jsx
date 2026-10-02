import { Field } from "./BlockEditors.jsx";

const FIELD_TYPES = [
  { value: "text", label: "Text" },
  { value: "tel", label: "Phone" },
  { value: "email", label: "Email" },
  { value: "textarea", label: "Long text" },
  { value: "select", label: "Dropdown" },
  { value: "date", label: "Date" },
  { value: "number", label: "Number" },
];

function emptyField(index = 0) {
  return {
    id: `field_${Date.now()}_${index}`,
    type: "text",
    label: "New field",
    placeholder: "",
    required: false,
    options: [],
  };
}

export default function EventRegistrationFormEditor({ registrationForm, onChange }) {
  const rf = registrationForm || { useCustomFields: false, formTitle: "", submitLabel: "", fields: [] };
  const fields = rf.fields || [];

  const patch = (key, value) => onChange({ ...rf, [key]: value });

  const updateField = (idx, key, value) => {
    const next = fields.map((f, i) => (i === idx ? { ...f, [key]: value } : f));
    patch("fields", next);
  };

  return (
    <div className="admin-event-form-editor">
      <p className="admin-hint">
        Leave <strong>custom fields off</strong> to use the site default registration form (name, phone, message). Turn
        on custom fields to build a form unique to this event.
      </p>
      <Field label="Registration form title (optional)">
        <input
          value={rf.formTitle || ""}
          placeholder="Register interest"
          onChange={(e) => patch("formTitle", e.target.value)}
        />
      </Field>
      <Field label="Submit button label (optional)">
        <input value={rf.submitLabel || ""} placeholder="Register" onChange={(e) => patch("submitLabel", e.target.value)} />
      </Field>
      <label className="admin-toggle-row">
        <input
          type="checkbox"
          checked={!!rf.useCustomFields}
          onChange={(e) => patch("useCustomFields", e.target.checked)}
        />
        <span>Use custom registration fields for this event</span>
      </label>

      {rf.useCustomFields ? (
        <div className="admin-stack admin-stack-tight">
          {fields.map((field, idx) => (
            <div key={field.id || idx} className="admin-card admin-event-field-card">
              <div className="admin-grid admin-grid-dense">
                <Field label="Field ID (unique)">
                  <input value={field.id || ""} onChange={(e) => updateField(idx, "id", e.target.value.replace(/\s/g, "_"))} />
                </Field>
                <Field label="Type">
                  <select value={field.type || "text"} onChange={(e) => updateField(idx, "type", e.target.value)}>
                    {FIELD_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Label">
                  <input value={field.label || ""} onChange={(e) => updateField(idx, "label", e.target.value)} />
                </Field>
                <Field label="Placeholder">
                  <input value={field.placeholder || ""} onChange={(e) => updateField(idx, "placeholder", e.target.value)} />
                </Field>
                <Field label="Required">
                  <select
                    value={field.required ? "true" : "false"}
                    onChange={(e) => updateField(idx, "required", e.target.value === "true")}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </Field>
              </div>
              {field.type === "select" ? (
                <Field label="Options (one per line)">
                  <textarea
                    rows={3}
                    value={(field.options || []).join("\n")}
                    onChange={(e) =>
                      updateField(
                        idx,
                        "options",
                        e.target.value
                          .split("\n")
                          .map((s) => s.trim())
                          .filter(Boolean)
                      )
                    }
                  />
                </Field>
              ) : null}
              <button
                type="button"
                className="admin-danger admin-danger-inline"
                onClick={() => patch("fields", fields.filter((_, i) => i !== idx))}
              >
                Remove field
              </button>
            </div>
          ))}
          <button
            type="button"
            className="admin-mini-btn"
            onClick={() => patch("fields", [...fields, emptyField(fields.length)])}
          >
            + Add form field
          </button>
        </div>
      ) : null}
    </div>
  );
}
