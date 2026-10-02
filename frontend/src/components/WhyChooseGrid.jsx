import MedicalIcon from "./MedicalIcon.jsx";
import Reveal from "./Reveal.jsx";
import "./WhyChooseGrid.css";

export default function WhyChooseGrid({ title, subtitle, items = [] }) {
  if (!items.length) return null;
  return (
    <section className="section why-section">
      <div className="container">
        <Reveal>
          <div className="section-intro center">
            {title ? <h2 className="section-title">{title}</h2> : null}
            {subtitle ? <p className="section-lead">{subtitle}</p> : null}
          </div>
        </Reveal>
        <div className="why-grid">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={i * 70}>
            <article className="why-card hover-lift">
              <div className="why-card-head">
                <div className="why-icon">
                  <MedicalIcon name={item.icon} size={26} />
                </div>
                <h3>{item.title}</h3>
              </div>
              <p>{item.text}</p>
            </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
