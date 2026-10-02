import { Field } from "./BlockEditors.jsx";
import ImageUploadField from "./ImageUploadField.jsx";
import { buildPostSeo } from "./seoAuto.js";

export default function BlogPostSeoEditor({ post, index, siteName, location, update, token }) {
  const seo = post.seo || {};

  const autoFill = () => {
    const next = buildPostSeo(post, siteName, location);
    update(`posts.${index}.seo`, { ...seo, ...next });
  };

  return (
    <div className="admin-stack admin-stack-tight">
      <p className="admin-hint">
        Title, description and keywords power Google SEO, Facebook Open Graph, and Twitter Cards when this article is
        shared.
      </p>
      <button type="button" className="admin-mini-btn admin-seo-enrich" onClick={autoFill}>
        Auto-fill SEO from title & excerpt
      </button>
      <Field label="SEO title">
        <input value={seo.title || ""} onChange={(e) => update(`posts.${index}.seo.title`, e.target.value)} />
      </Field>
      <Field label="Meta description">
        <textarea rows={2} value={seo.description || ""} onChange={(e) => update(`posts.${index}.seo.description`, e.target.value)} />
      </Field>
      <Field label="Keywords (comma separated)">
        <textarea rows={2} value={seo.keywords || ""} onChange={(e) => update(`posts.${index}.seo.keywords`, e.target.value)} />
      </Field>
      <Field label="Social share title (optional)">
        <input value={seo.shareTitle || ""} placeholder="Defaults to SEO title" onChange={(e) => update(`posts.${index}.seo.shareTitle`, e.target.value)} />
      </Field>
      <Field label="Social share text (optional)">
        <textarea rows={2} value={seo.shareText || ""} placeholder="Defaults to meta description + CTA" onChange={(e) => update(`posts.${index}.seo.shareText`, e.target.value)} />
      </Field>
      <ImageUploadField
        label="Share image (Open Graph / Twitter)"
        value={seo.ogImage || post.image || ""}
        folder="seo"
        token={token}
        onChange={(url) => update(`posts.${index}.seo.ogImage`, url)}
      />
      <Field label="Share image alt text">
        <input value={seo.ogImageAlt || ""} onChange={(e) => update(`posts.${index}.seo.ogImageAlt`, e.target.value)} />
      </Field>
      <Field label="Article tags (for schema)">
        <input value={seo.tags || post.category || ""} onChange={(e) => update(`posts.${index}.seo.tags`, e.target.value)} />
      </Field>
    </div>
  );
}
