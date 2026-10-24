import "./Hero.css";

export default function Hero({ site, contact }) {
  const phone = contact?.phones?.[0];

  return (
    <section id="home" className="hero section">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="hero-eyebrow">Established {site.established} · {site.location}</p>
          <h1 className="hero-title">{site.name}</h1>
          <p className="hero-text">{site.tagline}</p>
          <p className="hero-desc">
            Professional nurses, attendants, and physiotherapists for home care, baby care,
            elder support, and patient recovery — with a focus on safety, dignity, and trust.
          </p>
          <div className="hero-actions">
            <a href="#contact" className="btn btn-primary">
              Book a consultation
            </a>
            <a href={`tel:${phone}`} className="btn btn-outline">
              Call {phone}
            </a>
          </div>
          <ul className="hero-stats">
            <li>
              <strong>8+</strong>
              <span>Care services</span>
            </li>
            <li>
              <strong>24/7</strong>
              <span>Support available</span>
            </li>
            <li>
              <strong>100%</strong>
              <span>Client-focused care</span>
            </li>
          </ul>
        </div>
        <div className="hero-visual">
          <div className="hero-image-wrap">
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80"
              alt="Healthcare professional providing patient care"
              loading="eager"
            />
            <div className="hero-badge">
              <span className="hero-badge-icon">+</span>
              <div>
                <strong>Licensed care team</strong>
                <span>Trained nursing staff</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
