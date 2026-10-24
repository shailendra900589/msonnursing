import ServiceIcon from "./ServiceIcon.jsx";
import "./Services.css";

export default function Services({ services }) {
  return (
    <section id="services" className="services section">
      <div className="container">
        <h2 className="section-title">Our Services</h2>
        <p className="section-lead">
          Comprehensive nursing and home-care solutions — from newborn and elder support to
          physiotherapy and skilled attendants.
        </p>
        <div className="services-grid">
          {services.map((service) => (
            <article key={service.id} className="service-card">
              <div className="service-icon">
                <ServiceIcon name={service.icon} />
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <a href="#contact" className="service-link">
                Enquire now →
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
