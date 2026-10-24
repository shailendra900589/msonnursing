import { useEffect, useState } from "react";
import { useAdminEditor } from "./AdminEditorContext.jsx";
import { newEvent, newPost, EVENT_TYPES } from "./contentHelpers.js";
import IconPicker from "./IconPicker.jsx";
import ImageUploadField from "./ImageUploadField.jsx";
import AdminMediaLibrary from "./AdminMediaLibrary.jsx";
import { Field, IconCardsEditor, StepsEditor, LinesEditor, TestimonialsEditor } from "./BlockEditors.jsx";
import { SmartObjectFields } from "./AdminFormFields.jsx";
import { AdminAccordion, AdminSubTabs } from "./AdminUi.jsx";
import AdminAppearanceEditor from "./AdminAppearanceEditor.jsx";
import AdminEnquiriesPanel from "./AdminEnquiriesPanel.jsx";
import EventRegistrationFormEditor from "./EventRegistrationFormEditor.jsx";
import BlogPostSeoEditor from "./BlogPostSeoEditor.jsx";
import BlogPostExtrasEditor from "./BlogPostExtrasEditor.jsx";
import { applyAutoSeo } from "./seoAuto.js";
import { AdminErrorPanel, AdminLoadingPanel } from "./AdminStatePanel.jsx";
import ServicesCatalogEditor from "./ServicesCatalogEditor.jsx";
import AdminOverview from "./AdminOverview.jsx";
import AdminLeadsPanel from "./AdminLeadsPanel.jsx";
import AdminJobsEditor from "./AdminJobsEditor.jsx";
import { PAGE_LINKS } from "./adminNav.js";

const PAGE_TABS = PAGE_LINKS;

const HOME_TABS = [
  { id: "hero", label: "Hero & CTAs" },
  { id: "story", label: "Story & stats" },
  { id: "sections", label: "Page sections" },
  { id: "modules", label: "Cards & steps" },
];

function NavEditor({ title, items, path, data, onChange }) {
  const list = items || [];
  const updateItem = (index, key, value) => {
    const next = structuredClone(data);
    next.navigation[path][index][key] = key === "end" ? value === "true" || value === true : value;
    onChange(null, null, next);
  };
  const add = () => {
    const next = structuredClone(data);
    next.navigation[path].push({ to: "/", label: "New link" });
    onChange(null, null, next);
  };
  const remove = (index) => {
    const next = structuredClone(data);
    next.navigation[path].splice(index, 1);
    onChange(null, null, next);
  };

  return (
    <section className="admin-card">
      <div className="admin-card-head">
        <h2>{title}</h2>
        <button type="button" className="admin-mini-btn" onClick={add}>
          + Add link
        </button>
      </div>
      {list.map((item, index) => (
        <div key={index} className="admin-row">
          <Field label="Path">
            <input value={item.to} onChange={(e) => updateItem(index, "to", e.target.value)} />
          </Field>
          <Field label="Label">
            <input value={item.label} onChange={(e) => updateItem(index, "label", e.target.value)} />
          </Field>
          {path === "main" ? (
            <Field label="Exact home match">
              <select
                value={item.end ? "true" : "false"}
                onChange={(e) => updateItem(index, "end", e.target.value)}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </Field>
          ) : null}
          <button type="button" className="admin-danger" onClick={() => remove(index)}>
            Remove
          </button>
        </div>
      ))}
    </section>
  );
}

export default function AdminDashboard() {
  const { section, setSection, pageTab, setPageTab, leadsOpen, setLeadsOpen, data, update, token, jsonText, setJsonText, setStatus, setStatusType, save, loading, loadError, reloadContent } =
    useAdminEditor();
  const [homeTab, setHomeTab] = useState("hero");
  const [hubTab, setHubTab] = useState("page");

  useEffect(() => {
    setHubTab("page");
  }, [section, pageTab]);

  const applyJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      update(null, null, parsed);
      setStatus("JSON loaded — click Publish changes.");
      setStatusType("success");
    } catch {
      setStatus("Invalid JSON syntax.");
      setStatusType("error");
    }
  };

  if (loading) return <AdminLoadingPanel />;
  if (loadError) return <AdminErrorPanel message={loadError} onRetry={reloadContent} />;
  if (!data) return <AdminErrorPanel message="No content loaded." onRetry={reloadContent} />;

  return (
    <div className="admin-panel admin-panel-fluid">
      {section === "dashboard" ? null : (
        <header className="admin-panel-head admin-panel-head-compact">
          <p className="admin-hint">
            Templates: {"{{phone}}"}, {"{{email}}"}, {"{{siteName}}"} · Right panel = live preview & styles
          </p>
        </header>
      )}

      {section === "dashboard" && leadsOpen ? <AdminLeadsPanel onClose={() => setLeadsOpen(false)} /> : null}

      {section === "dashboard" && !leadsOpen ? (
        <AdminOverview
          token={token}
          data={data}
          onOpenLeads={() => setLeadsOpen(true)}
          onOpen={(nextSection, nextPage) => {
            setLeadsOpen(false);
            setSection(nextSection);
            if (nextPage) setPageTab(nextPage);
          }}
        />
      ) : null}

      {section === "jobs" ? <AdminJobsEditor data={data} update={update} /> : null}

      {section === "pages" ? <AdminSubTabs tabs={PAGE_TABS} active={pageTab} onChange={setPageTab} /> : null}

      {section === "pages" && pageTab === "home" && (
        <>
          <AdminSubTabs tabs={HOME_TABS} active={homeTab} onChange={setHomeTab} />
          <div className="admin-stack admin-stack-tight">
            {homeTab === "hero" ? (
              <AdminAccordion title="Hero banner" summary="Headline, image, trust badge & buttons" defaultOpen>
                <SmartObjectFields data={data} pathPrefix="pages.home" onChange={update} skip={["stats"]} token={token} />
              </AdminAccordion>
            ) : null}

            {homeTab === "story" ? (
              <>
                <AdminAccordion title="About preview & CTA card" summary="Mid-page story and call card">
                  <SmartObjectFields
                    data={data}
                    pathPrefix="pages.home"
                    onChange={update}
                    skip={[
                      "stats",
                      "heroEyebrow",
                      "heroTitle",
                      "heroSubtitle",
                      "heroDescription",
                      "heroImage",
                      "heroImageAlt",
                      "ctaPrimary",
                      "ctaSecondary",
                      "trustBadgeIcon",
                      "trustBadgeTitle",
                      "trustBadgeText",
                    ]}
                    token={token}
                  />
                </AdminAccordion>
                <AdminAccordion title="Stats row" summary="Numbers under hero">
                  {(data.pages.home.stats || []).map((stat, index) => (
                    <div key={index} className="admin-row admin-row-compact">
                      <Field label="Value">
                        <input value={stat.value} onChange={(e) => update(`pages.home.stats.${index}.value`, e.target.value)} />
                      </Field>
                      <Field label="Label">
                        <input value={stat.label} onChange={(e) => update(`pages.home.stats.${index}.label`, e.target.value)} />
                      </Field>
                    </div>
                  ))}
                </AdminAccordion>
                <AdminAccordion title="Highlight bullets" summary="Checklist on homepage">
                  <LinesEditor label="Bullets (one per line)" lines={data.highlights} onChange={(lines) => update("highlights", lines)} />
                </AdminAccordion>
              </>
            ) : null}

            {homeTab === "sections" ? (
              <>
                <AdminAccordion title="Intro & events block" summary="Section titles and toggles">
                  <SmartObjectFields
                    data={data}
                    pathPrefix="blocks.home"
                    onChange={update}
                    skip={["whyItems", "processSteps", "processTitle", "processSubtitle", "whyTitle", "whySubtitle", "whyItems"]}
                    token={token}
                  />
                </AdminAccordion>
                <TestimonialsEditor
                  title="Testimonials"
                  items={data.testimonials}
                  path="testimonials"
                  update={update}
                  onAdd={() => {
                    const next = structuredClone(data);
                    next.testimonials = next.testimonials || [];
                    next.testimonials.push({
                      id: `t-${Date.now()}`,
                      name: "Family member",
                      role: "Lucknow",
                      quote: "",
                      published: true,
                    });
                    update(null, null, next);
                  }}
                  onRemove={(index) => {
                    const next = structuredClone(data);
                    next.testimonials.splice(index, 1);
                    update(null, null, next);
                  }}
                />
              </>
            ) : null}

            {homeTab === "modules" ? (
              <>
                <IconCardsEditor title="Why choose us" items={data.blocks?.home?.whyItems} path="blocks.home.whyItems" update={update} />
                <StepsEditor title="Care process steps" steps={data.blocks?.home?.processSteps} path="blocks.home.processSteps" update={update} />
                <AdminAccordion title="Why / process headings" summary="Section titles only">
                  <SmartObjectFields
                    data={data}
                    pathPrefix="blocks.home"
                    onChange={update}
                    skip={[
                      "whyItems",
                      "processSteps",
                      "introTitle",
                      "introText",
                      "eventsTitle",
                      "eventsSubtitle",
                      "showOnHome",
                      "homeEventsCount",
                      "testimonialsTitle",
                      "testimonialsSubtitle",
                      "showTestimonials",
                      "ctaTitle",
                      "ctaText",
                      "ctaButton",
                      "ctaLink",
                    ]}
                    token={token}
                  />
                </AdminAccordion>
              </>
            ) : null}
          </div>
        </>
      )}

      {section === "pages" && pageTab === "about" && (
        <div className="admin-stack">
          <section className="admin-card">
            <h2>Page header</h2>
            <SmartObjectFields data={data} pathPrefix="pages.about" onChange={update} token={token} />
          </section>
          <section className="admin-card">
            <h2>About story</h2>
            <SmartObjectFields data={data} pathPrefix="about" onChange={update} token={token} />
          </section>
          <section className="admin-card">
            <h2>Vision & commitment</h2>
            <SmartObjectFields
              data={data}
              pathPrefix="blocks.about"
              onChange={update}
              skip={["values"]}
              token={token}
            />
          </section>
          <IconCardsEditor title="Values" items={data.blocks?.about?.values} path="blocks.about.values" update={update} />
        </div>
      )}

      {section === "pages" && pageTab === "services" && (
        <>
          <AdminSubTabs
            tabs={[
              { id: "page", label: "Page content" },
              { id: "catalog", label: "Service catalog" },
            ]}
            active={hubTab}
            onChange={setHubTab}
          />
          {hubTab === "page" ? (
            <div className="admin-stack admin-stack-tight">
              <AdminAccordion title="Services page header" defaultOpen>
                <SmartObjectFields data={data} pathPrefix="pages.services" onChange={update} token={token} />
              </AdminAccordion>
              <AdminAccordion title="Intro & standards" defaultOpen>
                <SmartObjectFields data={data} pathPrefix="blocks.services" onChange={update} skip={["standards"]} token={token} />
                <LinesEditor
                  label="Care standards (one per line)"
                  lines={data.blocks?.services?.standards}
                  onChange={(lines) => update("blocks.services.standards", lines)}
                />
              </AdminAccordion>
            </div>
          ) : null}
          {hubTab === "catalog" ? <ServicesCatalogEditor data={data} update={update} token={token} /> : null}
        </>
      )}

      {section === "pages" && pageTab === "events" && (
        <>
          <AdminSubTabs
            tabs={[
              { id: "page", label: "Page & home block" },
              { id: "manage", label: "Camps & events" },
            ]}
            active={hubTab}
            onChange={setHubTab}
          />
          {hubTab === "page" ? (
            <div className="admin-stack admin-stack-tight">
              <AdminAccordion title="Events listing page" defaultOpen>
                <SmartObjectFields data={data} pathPrefix="pages.events" onChange={update} token={token} />
              </AdminAccordion>
              <AdminAccordion title="Homepage events section" defaultOpen>
                <SmartObjectFields
                  data={data}
                  pathPrefix="blocks.home"
                  onChange={update}
                  skip={[
                    "whyItems",
                    "processSteps",
                    "introTitle",
                    "introText",
                    "whyTitle",
                    "whySubtitle",
                    "processTitle",
                    "processSubtitle",
                    "ctaTitle",
                    "ctaText",
                    "ctaButton",
                    "ctaLink",
                    "testimonialsTitle",
                    "testimonialsSubtitle",
                    "showTestimonials",
                    "blogTitle",
                    "blogSubtitle",
                    "showBlogOnHome",
                    "homePostsCount",
                  ]}
                  token={token}
                />
              </AdminAccordion>
            </div>
          ) : null}
          {hubTab === "manage" ? (
            <div className="admin-stack admin-stack-tight">
              <button
                type="button"
                className="admin-mini-btn"
                onClick={() => {
                  const next = structuredClone(data);
                  if (!next.events) next.events = [];
                  next.events.unshift(newEvent());
                  update(null, null, next);
                }}
              >
                + Create event / camp
              </button>
              {(data.events || []).map((ev, index) => (
                <AdminAccordion key={`${ev.id}-${index}`} title={ev.title} summary={ev.type || "event"} defaultOpen={index === 0}>
                  <div className="admin-grid admin-grid-dense">
                    <Field label="Slug (URL id)">
                      <input value={ev.id} onChange={(e) => update(`events.${index}.id`, e.target.value)} />
                    </Field>
                    <Field label="Type">
                      <select value={ev.type} onChange={(e) => update(`events.${index}.type`, e.target.value)}>
                        {EVENT_TYPES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Published">
                      <select
                        value={ev.published === false ? "false" : "true"}
                        onChange={(e) => update(`events.${index}.published`, e.target.value === "true")}
                      >
                        <option value="true">Live</option>
                        <option value="false">Draft</option>
                      </select>
                    </Field>
                    <Field label="Featured on home">
                      <select
                        value={ev.featured ? "true" : "false"}
                        onChange={(e) => update(`events.${index}.featured`, e.target.value === "true")}
                      >
                        <option value="true">Featured</option>
                        <option value="false">Normal</option>
                      </select>
                    </Field>
                    <Field label="Title">
                      <input value={ev.title} onChange={(e) => update(`events.${index}.title`, e.target.value)} />
                    </Field>
                    <ImageUploadField
                      label="Event banner"
                      value={ev.image || ""}
                      folder="events"
                      token={token}
                      onChange={(url) => update(`events.${index}.image`, url)}
                    />
                    <Field label="Short description">
                      <input value={ev.shortDescription || ""} onChange={(e) => update(`events.${index}.shortDescription`, e.target.value)} />
                    </Field>
                    <Field label="Start date">
                      <input type="date" value={ev.date || ""} onChange={(e) => update(`events.${index}.date`, e.target.value)} />
                    </Field>
                    <Field label="End date">
                      <input type="date" value={ev.endDate || ""} onChange={(e) => update(`events.${index}.endDate`, e.target.value)} />
                    </Field>
                    <Field label="Time">
                      <input value={ev.time || ""} onChange={(e) => update(`events.${index}.time`, e.target.value)} />
                    </Field>
                    <Field label="Location">
                      <input value={ev.location || ""} onChange={(e) => update(`events.${index}.location`, e.target.value)} />
                    </Field>
                    <Field label="Full description">
                      <textarea rows={4} value={ev.description || ""} onChange={(e) => update(`events.${index}.description`, e.target.value)} />
                    </Field>
                    <LinesEditor label="Highlights" lines={ev.highlights} onChange={(lines) => update(`events.${index}.highlights`, lines)} />
                  </div>
                  <AdminAccordion title="Registration form" summary="Default or custom fields">
                    <EventRegistrationFormEditor
                      registrationForm={ev.registrationForm}
                      onChange={(next) => update(`events.${index}.registrationForm`, next)}
                    />
                  </AdminAccordion>
                  <button
                    type="button"
                    className="admin-danger"
                    onClick={() => {
                      if (!window.confirm("Delete this event?")) return;
                      const next = structuredClone(data);
                      next.events.splice(index, 1);
                      update(null, null, next);
                    }}
                  >
                    Delete event
                  </button>
                </AdminAccordion>
              ))}
            </div>
          ) : null}
        </>
      )}

      {section === "pages" && pageTab === "blog" && (
        <div className="admin-stack admin-stack-tight">
          <AdminAccordion title="Blog listing page" summary="Title and intro shown on /blog" defaultOpen>
            <SmartObjectFields data={data} pathPrefix="pages.blog" onChange={update} token={token} />
          </AdminAccordion>
          <div className="admin-card admin-card-head-row admin-blog-toolbar">
            <div>
              <h2>Articles</h2>
              <p className="admin-form-note admin-form-note--lead">Posts on the blog listing and their own pages.</p>
            </div>
            <div className="admin-head-actions">
              <button
                type="button"
                className="admin-mini-btn admin-seo-enrich"
                onClick={() => update(null, null, applyAutoSeo(data))}
              >
                Auto-fill SEO
              </button>
              <button
                type="button"
                className="admin-mini-btn admin-mini-btn-primary"
                onClick={() => {
                  const next = structuredClone(data);
                  if (!next.posts) next.posts = [];
                  next.posts.unshift(newPost());
                  update(null, null, next);
                }}
              >
                + New article
              </button>
            </div>
          </div>
          {(data.posts || []).map((post, index) => (
            <AdminAccordion key={`${post.id}-${index}`} title={post.title} summary={post.category || "Blog post"} defaultOpen={index === 0}>
              <div className="admin-grid admin-grid-dense">
                <Field label="URL slug">
                  <input value={post.id} onChange={(e) => update(`posts.${index}.id`, e.target.value)} />
                </Field>
                <Field label="Published">
                  <select
                    value={post.published === false ? "false" : "true"}
                    onChange={(e) => update(`posts.${index}.published`, e.target.value === "true")}
                  >
                    <option value="true">Live</option>
                    <option value="false">Draft</option>
                  </select>
                </Field>
                <Field label="Title">
                  <input value={post.title} onChange={(e) => update(`posts.${index}.title`, e.target.value)} />
                </Field>
                <Field label="Category">
                  <input value={post.category || ""} onChange={(e) => update(`posts.${index}.category`, e.target.value)} />
                </Field>
                <Field label="Date">
                  <input type="date" value={post.date || ""} onChange={(e) => update(`posts.${index}.date`, e.target.value)} />
                </Field>
                <Field label="Author">
                  <input value={post.author || ""} onChange={(e) => update(`posts.${index}.author`, e.target.value)} />
                </Field>
                <ImageUploadField
                  label="Cover image"
                  value={post.image || ""}
                  folder="images"
                  token={token}
                  onChange={(url) => update(`posts.${index}.image`, url)}
                />
                <Field label="Excerpt" className="admin-field-span-2">
                  <textarea rows={2} value={post.excerpt || ""} onChange={(e) => update(`posts.${index}.excerpt`, e.target.value)} />
                </Field>
                <Field label="Body" className="admin-field-span-2">
                  <textarea rows={6} value={post.body || ""} onChange={(e) => update(`posts.${index}.body`, e.target.value)} />
                </Field>
              </div>
              <AdminAccordion title="FAQ & related services" summary="Questions + service links on article page">
                <BlogPostExtrasEditor post={post} index={index} services={data.services} update={update} />
              </AdminAccordion>
              <AdminAccordion title="SEO & social sharing" summary="Title, description, Twitter Card, Open Graph">
                <BlogPostSeoEditor
                  post={post}
                  index={index}
                  siteName={data.site?.name}
                  location={data.site?.location?.split(",")[0]}
                  update={update}
                  token={token}
                />
              </AdminAccordion>
              <button
                type="button"
                className="admin-danger"
                onClick={() => {
                  if (!window.confirm("Delete this post?")) return;
                  const next = structuredClone(data);
                  next.posts.splice(index, 1);
                  update(null, null, next);
                }}
              >
                Delete post
              </button>
            </AdminAccordion>
          ))}
        </div>
      )}

      {section === "pages" && pageTab === "contact" && (
        <>
          <AdminSubTabs
            tabs={[
              { id: "page", label: "Page content" },
              { id: "settings", label: "Form & phones" },
              { id: "inbox", label: "Enquiries" },
            ]}
            active={hubTab}
            onChange={setHubTab}
          />
          {hubTab === "page" ? (
            <div className="admin-stack admin-stack-tight">
              <AdminAccordion title="Contact page header" defaultOpen>
                <SmartObjectFields data={data} pathPrefix="pages.contact" onChange={update} token={token} />
              </AdminAccordion>
              <AdminAccordion title="Info blocks" defaultOpen>
                <SmartObjectFields data={data} pathPrefix="blocks.contact" onChange={update} token={token} />
              </AdminAccordion>
            </div>
          ) : null}
          {hubTab === "settings" ? (
            <div className="admin-stack admin-stack-tight">
              <AdminAccordion title="Contact form labels" defaultOpen>
                <SmartObjectFields data={data} pathPrefix="forms.contact" onChange={update} token={token} />
              </AdminAccordion>
              <AdminAccordion title="Default event registration form" defaultOpen>
                <p className="admin-hint">
                  Used on every event detail page unless that event has custom registration fields enabled.
                </p>
                <SmartObjectFields data={data} pathPrefix="forms.eventRegistration" onChange={update} token={token} />
              </AdminAccordion>
              <AdminAccordion title="Phone, email & WhatsApp" defaultOpen>
                <div className="admin-grid admin-grid-dense">
                  <Field label="Phones (comma separated)">
                    <input
                      value={data.contact.phones.join(", ")}
                      onChange={(e) =>
                        update(
                          "contact.phones",
                          e.target.value.split(",").map((p) => p.trim()).filter(Boolean)
                        )
                      }
                    />
                  </Field>
                  <Field label="WhatsApp number">
                    <input value={data.contact.whatsapp || ""} onChange={(e) => update("contact.whatsapp", e.target.value.trim())} />
                  </Field>
                  <Field label="WhatsApp message">
                    <textarea rows={2} value={data.contact.whatsappMessage || ""} onChange={(e) => update("contact.whatsappMessage", e.target.value)} />
                  </Field>
                  <Field label="Instagram">
                    <input
                      value={data.contact.instagram || "https://www.instagram.com/msonnursingservices/"}
                      onChange={(e) => update("contact.instagram", e.target.value.trim())}
                    />
                  </Field>
                  <Field label="YouTube">
                    <input
                      value={data.contact.youtube || "https://www.youtube.com/@MsonNursingServices"}
                      onChange={(e) => update("contact.youtube", e.target.value.trim())}
                    />
                  </Field>
                  <SmartObjectFields data={data} pathPrefix="contact" onChange={update} skip={["phones", "whatsapp", "whatsappMessage", "instagram", "youtube", "social"]} token={token} />
                </div>
              </AdminAccordion>
            </div>
          ) : null}
          {hubTab === "inbox" ? <AdminEnquiriesPanel token={token} events={data.events || []} /> : null}
        </>
      )}

      {section === "media" && <AdminMediaLibrary token={token} />}

      {section === "site" && (
        <>
          <AdminSubTabs
            tabs={[
              { id: "page", label: "Brand & logo" },
              { id: "colors", label: "Colors & fonts" },
            ]}
            active={hubTab}
            onChange={setHubTab}
          />
          {hubTab === "page" ? (
            <SmartObjectFields data={data} pathPrefix="site" onChange={update} skip={["theme"]} token={token} />
          ) : null}
          {hubTab === "colors" ? <AdminAppearanceEditor data={data} update={update} /> : null}
        </>
      )}

      {section === "layout" && (
        <>
          <AdminSubTabs
            tabs={[
              { id: "menus", label: "Menus" },
              { id: "header", label: "Header" },
              { id: "footer", label: "Footer" },
            ]}
            active={hubTab}
            onChange={setHubTab}
          />
          {hubTab === "menus" ? (
            <div className="admin-stack admin-stack-tight">
              <NavEditor title="Main menu" items={data.navigation.main} path="main" data={data} onChange={update} />
              <NavEditor title="Footer links" items={data.navigation.footer} path="footer" data={data} onChange={update} />
            </div>
          ) : null}
          {hubTab === "header" ? (
            <div className="admin-stack admin-stack-tight">
              <section className="admin-card">
                <SmartObjectFields data={data} pathPrefix="header" onChange={update} token={token} />
              </section>
              <section className="admin-card">
                <h2>Top bar updates</h2>
                <p className="admin-hint">
                  One update per line. On the website each line scrolls from right to left, then the next line starts. Phone and email stay fixed on the right. This bar is hidden on mobile. Click Publish to save.
                </p>
                <LinesEditor
                  label="Announcement lines"
                  lines={data.header?.tickerLines || []}
                  onChange={(lines) => update("header.tickerLines", lines)}
                />
              </section>
            </div>
          ) : null}
          {hubTab === "footer" ? <SmartObjectFields data={data} pathPrefix="footer" onChange={update} token={token} /> : null}
        </>
      )}

      {section === "seo" && (
        <>
          <AdminSubTabs
            tabs={[
              { id: "meta", label: "SEO meta" },
              { id: "labels", label: "Button labels" },
            ]}
            active={hubTab}
            onChange={setHubTab}
          />
          {hubTab === "meta" ? (
            <div className="admin-stack admin-stack-tight">
              <AdminAccordion title="Global SEO & share CTA" defaultOpen>
                <p className="admin-hint">
                  shareCtaLabel and shareCtaAction feed Twitter Card labels and share descriptions site-wide.
                </p>
                <SmartObjectFields data={data} pathPrefix="seo.default" onChange={update} token={token} />
              </AdminAccordion>
              {Object.entries(data.seo.pages).map(([key]) => (
                <AdminAccordion key={key} title={`${key} page SEO`} defaultOpen={key === "home"}>
                  <SmartObjectFields data={data} pathPrefix={`seo.pages.${key}`} onChange={update} token={token} />
                </AdminAccordion>
              ))}
            </div>
          ) : null}
          {hubTab === "labels" ? <SmartObjectFields data={data} pathPrefix="labels" onChange={update} token={token} /> : null}
        </>
      )}

      {section === "system" && (
        <>
          <AdminSubTabs
            tabs={[
              { id: "messages", label: "System text" },
              { id: "json", label: "Advanced JSON" },
            ]}
            active={hubTab}
            onChange={setHubTab}
          />
          {hubTab === "messages" ? <SmartObjectFields data={data} pathPrefix="system" onChange={update} token={token} /> : null}
          {hubTab === "json" ? (
            <section className="admin-card">
              <h2>Full JSON</h2>
              <textarea className="admin-json" rows={22} value={jsonText} onChange={(e) => setJsonText(e.target.value)} />
              <div className="admin-json-actions">
                <button type="button" className="btn btn-outline" onClick={applyJson}>Apply JSON</button>
                <button type="button" className="btn btn-primary" onClick={() => { try { save(JSON.parse(jsonText)); } catch { setStatus("Invalid JSON"); setStatusType("error"); } }}>Publish JSON</button>
              </div>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}
