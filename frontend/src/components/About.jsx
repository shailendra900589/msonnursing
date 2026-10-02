import "./About.css";

export default function About({ about, highlights, site }) {
  return (
    <section id="about" className="about section">
      <div className="container about-grid">
        <div className="about-media">
          <img
            src="https://images.unsplash.com/photo-1631217868264-e5b1bbff1578?auto=format&fit=crop&w=800&q=80"
            alt="Nursing team in a clinical setting"
            loading="lazy"
          />
          <div className="about-card">
            <span className="about-card-num">{site.established}</span>
            <span>Serving families since</span>
          </div>
        </div>
        <div>
          <h2 className="section-title">{about.title}</h2>
          <p className="about-summary">{about.summary}</p>
          <ul className="about-list">
            {highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
