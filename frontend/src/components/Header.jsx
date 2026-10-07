import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { ArrowRight, Mail, Phone } from "lucide-react";
import { applyTemplate } from "../utils/template.js";
import { mediaUrl } from "../utils/mediaUrl.js";
import { formatPhone, phoneHref } from "../utils/phone.js";
import { MailMark, SafeText } from "./MailMark.jsx";
import "./Header.css";

function Ticker({ lines }) {
  if (!lines.length) return <div className="header-ticker" />;

  return (
    <div className="header-ticker">
      <div className="header-ticker-track">
        {lines.map((line) => (
          <span className="header-ticker-line" key={line}>
            <SafeText text={line} />
          </span>
        ))}
        {lines.map((line) => (
          <span className="header-ticker-line" key={`loop-${line}`} aria-hidden="true">
            <SafeText text={line} />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Header({ content }) {
  const [open, setOpen] = useState(false);
  const { contact, header, navigation, site } = content;
  const phone = contact?.phones?.[0];
  const vars = { phone: formatPhone(phone), email: contact?.email, siteName: site?.name };
  const ctaPath = header?.navCtaPath || "/contact";
  const links = (navigation?.main || []).filter((l) => l.to !== ctaPath);
  const tickerLines = (header?.tickerLines || [])
    .map((line) => applyTemplate(String(line || ""), vars).trim())
    .filter(Boolean);

  return (
    <header className="header">
      <div className="header-top">
        <div className="container header-top-inner">
          <Ticker lines={tickerLines} />
          <div className="header-top-contacts">
            <a href={phoneHref(phone)} className="header-top-link">
              <Phone size={15} aria-hidden />
              {applyTemplate(header?.phoneLine, vars)}
            </a>
            <Link to="/contact" className="header-top-link">
              <Mail size={15} aria-hidden />
              <SafeText text={applyTemplate(header?.emailLine, vars)} />
            </Link>
          </div>
        </div>
      </div>
      <div className="container header-main">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <img
            src={mediaUrl(site?.logoUrl || "/uploads/logos/logo.png")}
            alt={header?.logoAlt || site?.name}
            title={header?.logoAlt || site?.name}
            className="brand-logo"
            width={220}
            height={64}
          />
        </Link>
        <nav className={`nav ${open ? "nav-open" : ""}`} aria-label="Main">
          {links.map((l) => (
            <NavLink
              key={`${l.to}-${l.label}`}
              to={l.to}
              end={Boolean(l.end)}
              onClick={() => setOpen(false)}
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              {l.label}
            </NavLink>
          ))}
          {header?.navCtaLabel ? (
            <Link to={ctaPath} className="nav-cta" onClick={() => setOpen(false)}>
              {header.navCtaLabel}
              <ArrowRight size={16} aria-hidden />
            </Link>
          ) : null}
        </nav>
        <button
          type="button"
          className={`menu-btn ${open ? "open" : ""}`}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
