import { useEffect, useRef, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { ArrowRight, Mail, Phone } from "lucide-react";
import { applyTemplate } from "../utils/template.js";
import { mediaUrl } from "../utils/mediaUrl.js";
import { formatPhone, phoneHref } from "../utils/phone.js";
import { MailMark, SafeText } from "./MailMark.jsx";
import "./Header.css";

function Ticker({ lines }) {
  const trackRef = useRef(null);
  const signature = lines.join("\n");

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !signature) return;
    let offset = 0;
    let last = performance.now();
    let frame = 0;
    const speed = 48;
    const tick = (now) => {
      const half = track.scrollWidth / 2;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (half > 1) {
        offset = (offset + speed * dt) % half;
        track.style.transform = `translate3d(${-offset}px, 0, 0)`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [signature]);

  if (!lines.length) return <div className="header-ticker" />;

  return (
    <div className="header-ticker">
      <div className="header-ticker-track" ref={trackRef}>
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
  const headerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [topHidden, setTopHidden] = useState(false);
  const { contact, header, navigation, site } = content;
  const phone = contact?.phones?.[0];
  const vars = { phone: formatPhone(phone), email: contact?.email, siteName: site?.name };
  const ctaPath = header?.navCtaPath || "/contact";
  const links = (navigation?.main || []).filter((l) => l.to !== ctaPath);
  const tickerLines = (header?.tickerLines || [])
    .map((line) => applyTemplate(String(line || ""), vars).trim())
    .filter(Boolean);

  useEffect(() => {
    const root = headerRef.current;
    if (!root) return;
    const bar = root.querySelector(".header-top");
    const measure = () => {
      root.style.setProperty("--header-top-h", `${bar?.offsetHeight || 0}px`);
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (bar) observer.observe(bar);

    let last = window.scrollY;
    let hidden = false;
    const onScroll = () => {
      const y = window.scrollY;
      let next = hidden;
      if (y < 40) next = false;
      else if (y > last + 8) next = true;
      else if (y < last - 8) next = false;
      last = y;
      if (next === hidden) return;
      hidden = next;
      setTopHidden(next);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header ref={headerRef} className={`header${topHidden ? " is-top-hidden" : ""}`}>
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
