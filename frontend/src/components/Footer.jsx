import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { mediaUrl } from "../utils/mediaUrl.js";
import { mapEmbedSrc } from "../utils/mapEmbed.js";
import { formatPhone, phoneHref } from "../utils/phone.js";
import Reveal from "./Reveal.jsx";
import AgencyAttribution from "./AgencyAttribution.jsx";
import SocialLinks from "./SocialLinks.jsx";
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

function writtenLocation(address) {
  const text = String(address || "").replace(/\s+/g, " ").trim();
  if (!text) return [];
  const parts = text.split(",").map((part) => part.trim()).filter(Boolean);
  if (parts.length < 4) return [text];
  const city = parts[parts.length - 1];
  const body = parts.slice(0, -1);
  const lines = [];
  for (let i = 0; i < body.length; i += 2) {
    const chunk = body.slice(i, i + 2).map((part) =>
      part && part[0] === part[0].toLowerCase()
        ? part.charAt(0).toUpperCase() + part.slice(1)
        : part
    );
    const joined = chunk.join(", ");
    if (chunk.length === 2 && joined.length > 36) {
      lines.push(chunk[0], chunk[1]);
    } else {
      lines.push(joined);
    }
  }
  lines.push(city);
  return lines;
}

export default function Footer({ content }) {
  const { site, contact, footer, navigation } = content;
  const year = new Date().getFullYear();
  const footerLinks = navigation?.footer || navigation?.main || [];
  const mapSrc = mapEmbedSrc(footer?.mapEmbed);
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
            <p className="footer-blurb">
              Home nursing, home care, elder care, and GDA male attendants from a nursing agency in Lucknow.
            </p>
            <ul className="footer-highlights">
              <li>Since {site.established || "2020"}</li>
              <li>Male & female staff</li>
              <li>{contact?.hours || "Open daily, 8:00 AM – 8:00 PM"}</li>
            </ul>
            <SocialLinks contact={contact} className="footer-social" />
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
            {contact?.address ? (
              <p className="footer-address">
                <MapPin size={15} aria-hidden />
                <span>
                  <span className="footer-address-label">Location</span>
                  {writtenLocation(contact.address).map((line) => (
                    <span key={line} className="footer-address-line">
                      {line}
                    </span>
                  ))}
                </span>
              </p>
            ) : null}
          </div>
        </Reveal>
        <Reveal variant="up" delay={180}>
          <div className="footer-col footer-location">
            <strong>{footer?.locationTitle || "Location"}</strong>
            {mapSrc ? (
              <iframe
                className="footer-map"
                src={mapSrc}
                title={footer?.locationTitle || "Location"}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : mapsHref ? (
              <a className="footer-map-link" href={mapsHref} target="_blank" rel="noopener noreferrer">
                <MapPin size={16} aria-hidden />
                Open in Google Maps
              </a>
            ) : (
              <p className="footer-map-note">Add a map embed from the admin footer settings.</p>
            )}
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
