import { useOutletContext } from "react-router-dom";
import { Clock, Mail, MapPin, Phone, PhoneCall } from "lucide-react";
import ContactEnquiryForm from "../components/ContactEnquiryForm.jsx";
import Seo from "../components/Seo.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Reveal from "../components/Reveal.jsx";
import { applyTemplate } from "../utils/template.js";
import { formatPhone, phoneHref } from "../utils/phone.js";
import SocialLinks from "../components/SocialLinks.jsx";
import "./ContactPage.css";

export default function ContactPage() {
  const { content } = useOutletContext();
  const { contact, forms, labels } = content;
  const page = content.pages.contact;
  const block = content.blocks?.contact || {};
  const form = forms.contact;
  const vars = { phone: contact.phones[0], email: contact.email };
  const pageTitle = page.title || "Contact";
  const mapsHref = contact.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`
    : "";

  const highlights = [
    { title: block.emergencyTitle, text: applyTemplate(block.emergencyText, vars), icon: PhoneCall },
    { title: block.areaTitle, text: block.areaText, icon: MapPin },
    { title: block.noteTitle, text: block.noteText, icon: Clock },
  ].filter((item) => item.title && item.text);

  return (
    <>
      <Seo pageKey="contact" />
      <PageHeader
        title={pageTitle}
        subtitle={page.subtitle}
        breadcrumbs={[
          { label: labels?.homeBreadcrumb, to: "/" },
          { label: pageTitle, to: null },
        ]}
      />
      <section className="section section-alt contact-page">
        <div className="container contact-page-stack">
          {highlights.length ? (
            <div className="contact-highlights">
              {highlights.map((item, i) => {
                const Icon = item.icon;
                return (
                  <Reveal key={item.title} variant="up" delay={i * 70} className="contact-highlight-wrap">
                    <article className="contact-highlight hover-lift">
                      <span className="contact-highlight-icon" aria-hidden>
                        <Icon size={18} />
                      </span>
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.text}</p>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          ) : null}

          <div className="contact-page-grid">
            <Reveal variant="left" className="contact-details-wrap">
              <aside className="contact-details-card">
                <p className="contact-details-kicker">{labels?.contactDetailsTitle || "Contact details"}</p>
                <h2>Talk to our care desk</h2>
                <p className="contact-details-intro">
                  Call, email, or send the form. A coordinator will confirm staff, timing, and home visits in Lucknow.
                </p>
                <dl className="contact-detail-list">
                  <div>
                    <dt>{labels?.phoneLabel || "Phone"}</dt>
                    <dd>
                      {contact.phones.map((phone) => (
                        <a key={phone} href={phoneHref(phone)} className="contact-detail-row">
                          <Phone size={16} aria-hidden />
                          <span>{formatPhone(phone)}</span>
                        </a>
                      ))}
                    </dd>
                  </div>
                  <div>
                    <dt>{labels?.emailLabel || "Email"}</dt>
                    <dd>
                      <a href={`mailto:${contact.email}`} className="contact-detail-row">
                        <Mail size={16} aria-hidden />
                        <span>{contact.email}</span>
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt>{labels?.addressLabel || "Address"}</dt>
                    <dd>
                      <p className="contact-detail-row">
                        <MapPin size={16} aria-hidden />
                        <span>{contact.address}</span>
                      </p>
                      {mapsHref ? (
                        <a className="contact-maps-link" href={mapsHref} target="_blank" rel="noopener noreferrer">
                          Open in Google Maps
                        </a>
                      ) : null}
                    </dd>
                  </div>
                  {contact.hours ? (
                    <div>
                      <dt>{labels?.hoursLabel || "Hours"}</dt>
                      <dd>
                        <p className="contact-detail-row">
                          <Clock size={16} aria-hidden />
                          <span>{contact.hours}</span>
                        </p>
                      </dd>
                    </div>
                  ) : null}
                </dl>
                <SocialLinks contact={contact} className="contact-social" />
              </aside>
            </Reveal>
            <Reveal variant="right" delay={90} className="contact-form-wrap">
              <ContactEnquiryForm
                contact={contact}
                form={form}
                labels={labels}
                sourcePath="/contact"
                sourcePage={pageTitle}
              />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
