import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { mediaUrl } from "../utils/mediaUrl.js";
import { formatPhone, phoneHref } from "../utils/phone.js";
import Reveal from "./Reveal.jsx";
import AgencyAttribution from "./AgencyAttribution.jsx";
import "./Footer.css";

const FOOTER_LABELS = {
  "/": "Homepage",
  "/about": "About us",
  "/services": "All services",
  "/blog": "Care articles",
  "/events": "Health events",
  "/contact": "Contact us",
  "/jobs": "Careers",
};

function footerAnchor(link) {
  return FOOTER_LABELS[link.to] || link.label;
}

export default function Footer({ content }) {
  const { site, contact, footer, navigation } = content;
  const year = new Date().getFullYear();
  const footerLinks = navigation?.footer || navigation?.main || [];
  const mapsHref = contact?.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`
    : "";

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <Reveal variant="up">
          <div className="footer-brand">
            <span className="footer-logo-shell">
              <img
                src={mediaUrl(site?.logoUrl || "/uploads/logos/logo.png")}
                alt={site.name}
                title={site.name}
                width={200}
                height={58}
                className="footer-logo"
              />
            </span>
            <h2 className="footer-keyword-title">
              Mson Nursing Services: home nursing, home care, elder care and GDA male attendants
            </h2>
            <h3 className="footer-keyword-sub">Nursing agency in Lucknow for nursing care</h3>
            <ul className="footer-highlights">
              <li>Since {site.established || "2020"}</li>
              <li>Male & female staff</li>
              <li>{contact?.hours || "Open daily, 8:00 AM – 8:00 PM"}</li>
            </ul>
          </div>
        </Reveal>
        <Reveal variant="up" delay={80}>
          <div className="footer-col">
            <strong>{footer?.quickLinksTitle}</strong>
            {footerLinks.map((l) => (
              <Link key={`${l.to}-${l.label}`} to={l.to}>
                {footerAnchor(l)}
              </Link>
            ))}
          </div>
        </Reveal>
        <Reveal variant="up" delay={140}>
          <div className="footer-col">
            <strong>{footer?.contactTitle}</strong>
            <div className="footer-phones">
              {contact.phones.map((p) => (
                <a key={p} href={phoneHref(p)} className="footer-link-row">
                  <Phone size={15} aria-hidden />
                  {formatPhone(p)}
                </a>
              ))}
            </div>
            <a href={`mailto:${contact.email}`} className="footer-link-row">
              <Mail size={15} aria-hidden />
              {contact.email}
            </a>
          </div>
        </Reveal>
        <Reveal variant="up" delay={180}>
          <div className="footer-col footer-location">
            <strong>{footer?.locationTitle || "Location"}</strong>
            {contact?.address ? (
              <address className="footer-address">
                <MapPin size={15} aria-hidden />
                <span>{contact.address}</span>
              </address>
            ) : null}
            {mapsHref ? (
              <a className="footer-map-link" href={mapsHref} target="_blank" rel="noopener noreferrer">
                <MapPin size={16} aria-hidden />
                View map
              </a>
            ) : null}
          </div>
        </Reveal>
      </div>
      <div className="footer-bottom">
        <div className="container footer-bottom-grid">
          <p className="footer-copy">© {year} All rights reserved by msonnursing.</p>
          <AgencyAttribution className="footer-agency" />
        </div>
      </div>
    </footer>
  );
}
