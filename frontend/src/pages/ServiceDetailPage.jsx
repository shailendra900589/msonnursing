import { Link, useOutletContext, useParams } from "react-router-dom";
import { useMemo } from "react";
import {
  ArrowLeft,
  Award,
  BadgeCheck,
  Clock,
  HelpCircle,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
  ChevronRight,
  Mail,
  Send,
  Truck,
} from "lucide-react";
import Seo from "../components/Seo.jsx";
import ShareBar from "../components/ShareBar.jsx";
import PageHeader from "../components/PageHeader.jsx";
import ServiceIcon from "../components/ServiceIcon.jsx";
import Reveal from "../components/Reveal.jsx";
import Btn from "../components/ui/Btn.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";
import ContactEnquiryForm from "../components/ContactEnquiryForm.jsx";
import { mediaUrl } from "../utils/mediaUrl.js";
import { SERVICE_CATEGORIES } from "../utils/serviceCategories.js";
import { sortServices } from "../utils/sortServices.js";
import { whatsappUrl } from "../utils/whatsapp.js";
import "./ServiceDetailPage.css";

const AREAS_SERVED = ["Indira Nagar", "Gomti Nagar", "Aliganj", "Hazratganj", "Alambagh", "Nearby localities"];

function paragraphs(text) {
  if (!text) return [];
  return text.split(/\n\n+/).filter(Boolean);
}

function categoryLabel(id) {
  return SERVICE_CATEGORIES.find((c) => c.id === id)?.label || "Home nursing";
}

function serviceSubtitle(service, city) {
  const sd = service.shortDescription?.trim() || "";
  const title = service.title.trim();
  if (sd && sd !== title && sd.length > 20 && !/^professional\s+gda/i.test(sd)) {
    return sd;
  }
  return `${categoryLabel(service.category)} at home in ${city}`;
}

export default function ServiceDetailPage() {
  const { id } = useParams();
  const { content } = useOutletContext();
  const service = content.services.find((s) => s.id === id);
  const labels = content.labels;
  const form = content.forms?.contact;
  const contact = content.contact;
  const city = content.site?.location?.split(",")[0]?.trim() || "Lucknow";
  const phone = contact?.phones?.[0];

  const related = useMemo(() => {
    if (!service) return [];
    const list = sortServices(content.services || []).filter((s) => s.id !== service.id);
    const same = list.filter((s) => s.category === service.category);
    const pool = same.length >= 3 ? same : list;
    return pool.slice(0, 4);
  }, [content.services, service]);

  if (!service) {
    return (
      <div className="container section center">
        <Seo
          noindex
          title="Service not found | Mson Nursing Services"
          description="This nursing service page is not available. Browse home nursing services in Lucknow."
        />
        <h1>{labels?.serviceNotFound}</h1>
        <Btn to="/services">{labels?.backToServices}</Btn>
      </div>
    );
  }

  const eeat = service.eeat || {};
  const allParts = paragraphs(service.longContent || service.description);
  const lead = allParts[0] || service.description || service.shortDescription;
  const restParts = allParts.length > 1 ? allParts.slice(1) : [];
  const idealFor = service.idealFor?.length ? service.idealFor : [];
  const careSteps = service.careSteps?.length ? service.careSteps : [];

  const waLink = whatsappUrl(
    contact.whatsapp || phone,
    `Hello, I would like to book: ${service.title} (${city}).`
  );

  const trustCards = [
    { key: "expertise", title: "Clinical expertise", text: eeat.expertise, icon: Stethoscope },
    { key: "experience", title: "Proven experience", text: eeat.experience, icon: Clock },
    { key: "authoritativeness", title: "Local reputation", text: eeat.authoritativeness, icon: Award },
    { key: "trust", title: "Trust & safety", text: eeat.trust, icon: ShieldCheck },
  ].filter((c) => c.text);

  return (
    <article className="service-page page-enter">
      <Seo pageKey={`service-${service.id}`} service={service} />
      <PageHeader
        title={service.title}
        subtitle={serviceSubtitle(service, city)}
        breadcrumbs={[
          { label: labels?.homeBreadcrumb, to: "/" },
          { label: content.pages.services.title, to: "/services" },
          { label: service.title, to: null },
        ]}
      />

      <section id="service-buy" className="service-section service-product service-module">
        <div className="container">
          <Reveal variant="fade">
            <Link to="/services" className="service-back-link">
              <ArrowLeft size={16} aria-hidden /> {labels?.backToServices || "All services"}
            </Link>
          </Reveal>

          <div className="service-product-grid">
            <Reveal variant="scale" className="service-product-gallery">
              <div className="service-product-image-frame hover-lift">
                <img src={mediaUrl(service.image)} alt={service.imageAlt || service.title} title={service.imageAlt || service.title} className="service-product-image" />
              </div>
              <ul className="service-product-gallery-trust" aria-label="Service guarantees">
                {[
                  { icon: BadgeCheck, text: "Verified staff" },
                  { icon: Users, text: "Male & female" },
                  { icon: Sparkles, text: "Since 2020" },
                ].map((item, i) => (
                  <li key={item.text} style={{ "--trust-i": i }}>
                    <item.icon size={15} aria-hidden /> {item.text}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal variant="right" delay={80} className="service-product-buybox">
              <div className="service-product-kicker">
                <p className="service-product-brand">{content.site.name}</p>
                <p className="service-product-category">
                  <ServiceIcon name={service.icon} size={16} aria-hidden />
                  {categoryLabel(service.category)}
                </p>
              </div>
              <h2 className="service-product-title">{service.title}</h2>
              <p className="service-product-tagline">{serviceSubtitle(service, city)}</p>

              <div className="service-product-price-block">
                {service.price ? (
                  <>
                    <span className="service-product-price">{service.price}</span>
                    {service.priceNote ? <span className="service-product-price-meta">{service.priceNote}</span> : null}
                  </>
                ) : (
                  <>
                    <span className="service-product-price service-product-price--quote">Price on request</span>
                    <span className="service-product-price-meta">Coordinator confirms before booking</span>
                  </>
                )}
              </div>

              <div className="service-product-offers">
                <span>
                  <Truck size={15} aria-hidden /> Home visit in {city}
                </span>
                <span>
                  <Clock size={15} aria-hidden /> Same-day enquiry response
                </span>
              </div>

              <div className="service-product-actions">
                {phone ? (
                  <Btn href={`tel:${phone.replace(/\s/g, "")}`} icon={Phone} pulse className="service-buy-btn">
                    Call to book · {phone}
                  </Btn>
                ) : null}
                {waLink ? (
                  <Btn
                    href={waLink}
                    variant="outline"
                    icon={MessageCircle}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="service-buy-btn"
                  >
                    Order on WhatsApp
                  </Btn>
                ) : null}
                <a href="#service-faq-book" className="service-product-enquiry-link">
                  <Send size={16} aria-hidden /> Send an enquiry form
                </a>
              </div>

              <dl className="service-product-specs">
                <div>
                  <dt>Service type</dt>
                  <dd>{categoryLabel(service.category)}</dd>
                </div>
                <div>
                  <dt>Service area</dt>
                  <dd>
                    {city}, Uttar Pradesh
                  </dd>
                </div>
                <div>
                  <dt>Support</dt>
                  <dd>{phone}</dd>
                </div>
                {contact.email ? (
                  <div>
                    <dt>Email</dt>
                    <dd>{contact.email}</dd>
                  </div>
                ) : null}
              </dl>

              <div className="service-product-shipping">
                <p className="service-product-shipping-label">
                  <MapPin size={15} aria-hidden /> Areas we cover
                </p>
                <div className="service-area-tags">
                  {AREAS_SERVED.map((area) => (
                    <span key={area} className="service-area-tag">
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <ShareBar pageKey={`service-${service.id}`} service={service} className="service-share-bar" hideCta />
            </Reveal>
          </div>
        </div>
      </section>

      <section id="service-about" className="service-section service-body service-module">
        <div className="container service-body-inner">
          <Reveal variant="up">
            <header className="service-overview-head">
              <div className="service-overview-icon service-icon-float">
                <ServiceIcon name={service.icon} size={26} />
              </div>
              <div>
                <h2>About this service</h2>
                <p className="service-overview-lead">{lead}</p>
              </div>
            </header>
          </Reveal>

          {restParts.length ? (
            <Reveal variant="up" delay={50}>
              <div className="service-prose hover-lift">
                {restParts.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
              </div>
            </Reveal>
          ) : null}

          {(idealFor.length || service.features?.length) ? (
            <Reveal variant="up" delay={70}>
              <div className="service-split-panel">
                {idealFor.length ? (
                  <div className="service-split-col hover-lift">
                    <h3>Who this is for</h3>
                    <ul className="service-check-list">
                      {idealFor.map((item) => (
                        <li key={item}>
                          <BadgeCheck size={17} aria-hidden />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {service.features?.length ? (
                  <div className="service-split-col hover-lift">
                    <h3>What is included</h3>
                    <ul className="service-check-list">
                      {service.features.map((f) => (
                        <li key={f}>
                          <BadgeCheck size={17} aria-hidden />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </Reveal>
          ) : null}

          {careSteps.length ? (
            <Reveal variant="up" delay={90}>
              <div className="service-steps-wrap">
                <SectionHeading
                  title="How it works"
                  subtitle="Simple steps when you connect with us"
                  icon={Clock}
                />
                <ol className="service-steps-row">
                  {careSteps.map((step, i) => (
                    <li key={step.title} className="service-step-chip hover-lift" style={{ "--step-i": i }}>
                      <span className="service-step-index">{i + 1}</span>
                      <strong>{step.title}</strong>
                      <p>{step.text}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          ) : null}

          {trustCards.length ? (
            <Reveal variant="up" delay={110}>
              <div className="service-trust-section">
                <SectionHeading
                  title={`Why families trust ${content.site.name}`}
                  subtitle="Qualified staff, clear communication, and local accountability"
                  icon={ShieldCheck}
                />
                <div className="service-trust-grid">
                  {trustCards.map((card, i) => {
                    const Icon = card.icon;
                    return (
                      <div key={card.key} className="service-trust-card hover-lift" style={{ "--trust-card-i": i }}>
                        <span className="service-trust-card-icon">
                          <Icon size={20} aria-hidden />
                        </span>
                        <h4>{card.title}</h4>
                        <p>{card.text}</p>
                      </div>
                    );
                  })}
                </div>
                {eeat.credentials ? (
                  <p className="service-credentials">
                    <Award size={17} aria-hidden /> {eeat.credentials}
                  </p>
                ) : null}
                {eeat.medicalDisclaimer ? <p className="service-disclaimer">{eeat.medicalDisclaimer}</p> : null}
              </div>
            </Reveal>
          ) : null}
        </div>
      </section>

      {related.length ? (
        <section className="service-section service-related-section service-module">
          <div className="container">
            <SectionHeading title="Related services" subtitle="Other care options you may need" icon={Stethoscope} />
            <div className="service-related-grid cards-grid-4">
              {related.map((item, i) => (
                <Reveal key={item.id} variant="up" delay={i * 70}>
                <Link to={`/services/${item.id}`} className="service-related-card hover-lift">
                  <img src={mediaUrl(item.image)} alt={item.imageAlt || item.title} title={item.imageAlt || item.title} loading="lazy" />
                  <div>
                    <h4>{item.title}</h4>
                    {item.price ? <p className="service-related-price">{item.price}</p> : null}
                    <span className="service-related-link">
                      View service <ChevronRight size={14} aria-hidden />
                    </span>
                  </div>
                </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section id="service-faq-book" className="service-section service-faq-book-section service-module">
        <div className="container service-faq-book-wrap">
          <SectionHeading
            title="Common questions & booking"
            subtitle={`${service.title} · ${city}`}
            icon={HelpCircle}
          />

          {service.faq?.length ? (
            <div className="service-faq-book-faq">
              <div className="service-faq-list">
                {service.faq.map((item, i) => (
                  <Reveal key={item.q} variant="up" delay={i * 55}>
                    <details className="service-faq-item hover-lift">
                      <summary>{item.q}</summary>
                      <p>{item.a}</p>
                    </details>
                  </Reveal>
                ))}
              </div>
            </div>
          ) : null}

          <div className="service-faq-book-contact">
            <Reveal variant="left" delay={80}>
              <aside className="service-help-panel hover-lift">
                <h3>Need help choosing?</h3>
                <p>
                  Book <strong>{service.title}</strong> — our coordinator will confirm staff, timing, and home visits in{" "}
                  {city}.
                </p>
                <ul className="service-help-list">
                  <li>
                    <BadgeCheck size={16} aria-hidden /> Free care guidance
                  </li>
                  <li>
                    <Clock size={16} aria-hidden /> Same-day callback
                  </li>
                  <li>
                    <MapPin size={16} aria-hidden /> Home visits across {city}
                  </li>
                </ul>
                <div className="service-help-actions">
                  {phone ? (
                    <Btn href={`tel:${phone.replace(/\s/g, "")}`} icon={Phone} pulse className="service-cta-full">
                      Call {phone}
                    </Btn>
                  ) : null}
                  {waLink ? (
                    <Btn
                      href={waLink}
                      variant="outline"
                      icon={MessageCircle}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="service-help-wa-btn"
                    >
                      WhatsApp
                    </Btn>
                  ) : null}
                </div>
                {contact.email ? (
                  <a href={`mailto:${contact.email}`} className="service-help-email">
                    <Mail size={16} aria-hidden /> {contact.email}
                  </a>
                ) : null}
                {service.features?.length ? (
                  <div className="service-help-includes">
                    <p>Included:</p>
                    <ul>
                      {service.features.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </aside>
            </Reveal>
            <Reveal variant="right" delay={120}>
              <div className="service-book-form-wrap hover-lift">
                <ContactEnquiryForm
                  contact={contact}
                  form={{ ...form, formTitle: form?.formTitle || "Send enquiry" }}
                  labels={labels}
                  sourcePath={`/services/${service.id}`}
                  sourcePage={`Service: ${service.title}`}
                  serviceId={service.id}
                  serviceTitle={service.title}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </article>
  );
}
