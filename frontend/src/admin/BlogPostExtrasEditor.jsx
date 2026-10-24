import { FaqEditor, Field } from "./BlockEditors.jsx";

export default function BlogPostExtrasEditor({ post, index, services, update }) {
  const faq = post.faq || [];
  const relatedIds = post.relatedServiceIds || [];

  const toggleService = (serviceId) => {
    const set = new Set(relatedIds);
    if (set.has(serviceId)) set.delete(serviceId);
    else set.add(serviceId);
    update(`posts.${index}.relatedServiceIds`, [...set]);
  };

  return (
    <div className="admin-stack admin-stack-tight">
      <FaqEditor
        items={faq}
        onChange={(next) => update(`posts.${index}.faq`, next)}
      />
      <Field label="Related services (shown on article page)" hint="Pick up to 4. Leave empty for auto-match by category.">
        <div className="admin-related-service-picks">
          {(services || []).slice(0, 24).map((s) => (
            <label key={s.id} className="admin-check-chip">
              <input type="checkbox" checked={relatedIds.includes(s.id)} onChange={() => toggleService(s.id)} />
              <span>{s.title}</span>
            </label>
          ))}
        </div>
      </Field>
    </div>
  );
}
