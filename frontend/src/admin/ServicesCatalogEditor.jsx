import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Sparkles } from "lucide-react";
import { newService } from "./contentHelpers.js";
import { Field, LinesEditor } from "./BlockEditors.jsx";
import IconPicker from "./IconPicker.jsx";
import ImageUploadField from "./ImageUploadField.jsx";
import { AdminAccordion } from "./AdminUi.jsx";
import { enrichService, insertServiceAt, moveService, normalizeServiceOrder } from "./serviceEnrich.js";
import { applyAutoSeo } from "./seoAuto.js";

function AddServiceButton({ onClick, label = "+ Add service here" }) {
  return (
    <button type="button" className="admin-add-inline" onClick={onClick}>
      {label}
    </button>
  );
}

export default function ServicesCatalogEditor({ data, update, token }) {
  const [openId, setOpenId] = useState(null);

  const ctx = useMemo(
    () => ({
      siteName: data.site?.name,
      city: data.site?.location?.split(",")[0],
      phone: data.contact?.phones?.[0],
      address: data.contact?.address,
    }),
    [data.site?.name, data.site?.location, data.contact?.phones, data.contact?.address]
  );

  const sorted = useMemo(() => normalizeServiceOrder(data.services || []), [data.services]);

  const replaceServices = (nextList) => {
    const next = structuredClone(data);
    next.services = nextList;
    update(null, null, next);
  };

  const insertAt = (atIndex) => {
    const list = insertServiceAt(data.services || [], atIndex, () => enrichService(newService(), ctx));
    replaceServices(list);
    setOpenId(list[atIndex]?.id || null);
  };

  const enrichOne = (index) => {
    const next = structuredClone(data);
    next.services[index] = enrichService(next.services[index], ctx);
    update(null, null, next);
  };

  const enrichAll = () => {
    const next = applyAutoSeo(data);
    next.services = normalizeServiceOrder(
      next.services.map((s) => enrichService(s, ctx))
    );
    update(null, null, next);
  };

  return (
    <div className="admin-stack admin-stack-tight">
      <div className="admin-catalog-toolbar">
        <button type="button" className="admin-mini-btn" onClick={() => insertAt(0)}>
          + New service (top)
        </button>
        <button type="button" className="admin-mini-btn admin-seo-enrich" onClick={enrichAll}>
          <Sparkles size={14} aria-hidden /> Enrich all (trust + SEO)
        </button>
      </div>

      <AddServiceButton onClick={() => insertAt(0)} />

      {sorted.map((service, sortedIndex) => {
        const index = data.services.findIndex((s) => s.id === service.id);
        const isOpen = openId === service.id;
        return (
          <div key={service.id} className="admin-catalog-block">
            <div className="admin-catalog-block-head">
              <span className="admin-sort-badge">#{service.sortOrder ?? sortedIndex + 1}</span>
              <div className="admin-sort-actions">
                <button
                  type="button"
                  title="Move up"
                  disabled={sortedIndex === 0}
                  onClick={() => replaceServices(moveService(data.services, sortedIndex, "up"))}
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  type="button"
                  title="Move down"
                  disabled={sortedIndex >= sorted.length - 1}
                  onClick={() => replaceServices(moveService(data.services, sortedIndex, "down"))}
                >
                  <ArrowDown size={16} />
                </button>
              </div>
            </div>
            <AdminAccordion
              key={`${service.id}-${isOpen ? "open" : "closed"}`}
              title={service.title}
              summary={service.price || service.category || "Service"}
              defaultOpen={isOpen}
            >
              <div className="admin-grid admin-grid-dense">
                <Field label="List position">
                  <input
                    type="number"
                    min={1}
                    value={service.sortOrder ?? index + 1}
                    onChange={(e) => update(`services.${index}.sortOrder`, Number(e.target.value))}
                  />
                </Field>
                <Field label="Slug (URL id)">
                  <input value={service.id} onChange={(e) => update(`services.${index}.id`, e.target.value)} />
                </Field>
                <Field label="Title">
                  <input value={service.title} onChange={(e) => update(`services.${index}.title`, e.target.value)} />
                </Field>
                <Field label="Price">
                  <input value={service.price || ""} onChange={(e) => update(`services.${index}.price`, e.target.value)} />
                </Field>
                <Field label="Price note">
                  <input value={service.priceNote || ""} onChange={(e) => update(`services.${index}.priceNote`, e.target.value)} />
                </Field>
                <IconPicker value={service.icon} onChange={(ic) => update(`services.${index}.icon`, ic)} />
                <ImageUploadField
                  label="Service image"
                  value={service.image || ""}
                  folder="services"
                  token={token}
                  onChange={(url) => update(`services.${index}.image`, url)}
                />
                <Field label="Short description">
                  <input value={service.shortDescription || ""} onChange={(e) => update(`services.${index}.shortDescription`, e.target.value)} />
                </Field>
                <Field label="Summary (SEO intro)">
                  <textarea rows={3} value={service.description || ""} onChange={(e) => update(`services.${index}.description`, e.target.value)} />
                </Field>
                <Field label="Long content (service page body)">
                  <textarea rows={6} value={service.longContent || ""} onChange={(e) => update(`services.${index}.longContent`, e.target.value)} />
                </Field>
                <LinesEditor label="Feature bullets" lines={service.features} onChange={(lines) => update(`services.${index}.features`, lines)} />
              </div>
              <details className="admin-seo-details">
                <summary>SEO, Geo & AEO fields</summary>
                <div className="admin-grid admin-grid-dense">
                  <Field label="Meta title">
                    <input value={service.seo?.title || ""} onChange={(e) => update(`services.${index}.seo.title`, e.target.value)} />
                  </Field>
                  <Field label="Meta description">
                    <textarea rows={2} value={service.seo?.description || ""} onChange={(e) => update(`services.${index}.seo.description`, e.target.value)} />
                  </Field>
                  <Field label="Keywords">
                    <textarea rows={2} value={service.seo?.keywords || ""} onChange={(e) => update(`services.${index}.seo.keywords`, e.target.value)} />
                  </Field>
                  <Field label="Tags">
                    <input value={service.seo?.tags || ""} onChange={(e) => update(`services.${index}.seo.tags`, e.target.value)} />
                  </Field>
                  <Field label="AEO summary (voice search)">
                    <textarea rows={2} value={service.seo?.aeoSummary || ""} onChange={(e) => update(`services.${index}.seo.aeoSummary`, e.target.value)} />
                  </Field>
                  <Field label="Sitemap priority">
                    <input value={service.seo?.sitemapPriority || "0.85"} onChange={(e) => update(`services.${index}.seo.sitemapPriority`, e.target.value)} />
                  </Field>
                </div>
              </details>
              <details className="admin-seo-details">
                <summary>Trust & authority content</summary>
                <div className="admin-grid admin-grid-dense">
                  {["expertise", "experience", "authoritativeness", "trust", "author", "credentials", "medicalDisclaimer"].map((key) => (
                    <Field key={key} label={key}>
                      <textarea
                        rows={key === "medicalDisclaimer" ? 2 : 2}
                        value={service.eeat?.[key] || ""}
                        onChange={(e) => update(`services.${index}.eeat.${key}`, e.target.value)}
                      />
                    </Field>
                  ))}
                </div>
              </details>
              <div className="admin-row-actions">
                <button type="button" className="admin-mini-btn" onClick={() => enrichOne(index)}>
                  <Sparkles size={14} /> Generate trust + SEO
                </button>
                <button
                  type="button"
                  className="admin-danger"
                  onClick={() => {
                    if (!window.confirm("Delete this service?")) return;
                    const next = structuredClone(data);
                    next.services.splice(index, 1);
                    update(null, null, { ...next, services: normalizeServiceOrder(next.services) });
                  }}
                >
                  Delete
                </button>
              </div>
            </AdminAccordion>
            <AddServiceButton onClick={() => insertAt(sortedIndex + 1)} label="+ Add service below" />
          </div>
        );
      })}
    </div>
  );
}
