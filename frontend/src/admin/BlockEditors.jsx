import IconPicker from "./IconPicker.jsx";

export function Field({ label, hint, children }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {hint ? <small className="admin-hint">{hint}</small> : null}
      {children}
    </label>
  );
}

export function IconCardsEditor({ title, items, path, update }) {
  return (
    <section className="admin-card">
      <h3 className="admin-sub">{title}</h3>
      {(items || []).map((item, index) => (
        <div key={index} className="admin-row admin-row-stack">
          <IconPicker
            value={item.icon}
            onChange={(ic) => update(`${path}.${index}.icon`, ic)}
          />
          <Field label="Title">
            <input
              value={item.title}
              onChange={(e) => update(`${path}.${index}.title`, e.target.value)}
            />
          </Field>
          <Field label="Text">
            <textarea
              rows={2}
              value={item.text}
              onChange={(e) => update(`${path}.${index}.text`, e.target.value)}
            />
          </Field>
        </div>
      ))}
    </section>
  );
}

export function StepsEditor({ title, steps, path, update }) {
  return (
    <section className="admin-card">
      <h3 className="admin-sub">{title}</h3>
      {(steps || []).map((step, index) => (
        <div key={index} className="admin-row admin-row-stack">
          <Field label="Step number">
            <input
              value={step.step}
              onChange={(e) => update(`${path}.${index}.step`, e.target.value)}
            />
          </Field>
          <Field label="Title">
            <input
              value={step.title}
              onChange={(e) => update(`${path}.${index}.title`, e.target.value)}
            />
          </Field>
          <Field label="Text">
            <textarea
              rows={2}
              value={step.text}
              onChange={(e) => update(`${path}.${index}.text`, e.target.value)}
            />
          </Field>
        </div>
      ))}
    </section>
  );
}

export function TestimonialsEditor({ title, items, path, update, onAdd, onRemove }) {
  return (
    <section className="admin-card">
      <div className="admin-row admin-row-head">
        <h3 className="admin-sub">{title}</h3>
        {onAdd ? (
          <button type="button" className="admin-mini-btn" onClick={onAdd}>
            + Add testimonial
          </button>
        ) : null}
      </div>
      {(items || []).map((item, index) => (
        <div key={item.id || index} className="admin-row admin-row-stack admin-bordered">
          <Field label="Name">
            <input value={item.name || ""} onChange={(e) => update(`${path}.${index}.name`, e.target.value)} />
          </Field>
          <Field label="Role / location (optional)">
            <input value={item.role || ""} onChange={(e) => update(`${path}.${index}.role`, e.target.value)} />
          </Field>
          <Field label="Quote">
            <textarea
              rows={3}
              value={item.quote || ""}
              onChange={(e) => update(`${path}.${index}.quote`, e.target.value)}
            />
          </Field>
          <Field label="Show on site">
            <select
              value={item.published === false ? "no" : "yes"}
              onChange={(e) => update(`${path}.${index}.published`, e.target.value === "yes")}
            >
              <option value="yes">Published</option>
              <option value="no">Hidden</option>
            </select>
          </Field>
          {onRemove ? (
            <button type="button" className="admin-mini-btn admin-danger" onClick={() => onRemove(index)}>
              Remove
            </button>
          ) : null}
        </div>
      ))}
    </section>
  );
}

export function LinesEditor({ label, lines, onChange }) {
  return (
    <Field label={label}>
      <textarea rows={6} value={(lines || []).join("\n")} onChange={(e) => onChange(e.target.value.split("\n").filter(Boolean))} />
    </Field>
  );
}

export function FaqEditor({ items = [], onChange, title = "FAQ (questions & answers)" }) {
  const list = items || [];

  const patch = (idx, key, value) => {
    const next = list.map((row, i) => (i === idx ? { ...row, [key]: value } : row));
    onChange(next);
  };

  return (
    <section className="admin-card">
      <div className="admin-row admin-row-head">
        <h3 className="admin-sub">{title}</h3>
        <button
          type="button"
          className="admin-mini-btn"
          onClick={() => onChange([...list, { q: "New question?", a: "" }])}
        >
          + Add FAQ
        </button>
      </div>
      {list.length === 0 ? <p className="admin-hint">No FAQ yet — add items for rich results and the article page.</p> : null}
      {list.map((item, index) => (
        <div key={`faq-${index}`} className="admin-row admin-row-stack">
          <Field label="Question">
            <input value={item.q || ""} onChange={(e) => patch(index, "q", e.target.value)} />
          </Field>
          <Field label="Answer">
            <textarea rows={3} value={item.a || ""} onChange={(e) => patch(index, "a", e.target.value)} />
          </Field>
          <button
            type="button"
            className="admin-mini-btn admin-danger"
            onClick={() => onChange(list.filter((_, i) => i !== index))}
          >
            Remove FAQ
          </button>
        </div>
      ))}
    </section>
  );
}
