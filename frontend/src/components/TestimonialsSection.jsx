import { Quote } from "lucide-react";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./ui/SectionHeading.jsx";
import "./TestimonialsSection.css";

export default function TestimonialsSection({ title, subtitle, items = [] }) {
  const list = items.filter((t) => t.published !== false && t.quote?.trim());
  if (!list.length) return null;

  return (
    <section className="section testimonials-section section-alt">
      <div className="container">
        <SectionHeading title={title} subtitle={subtitle} icon={Quote} />
        <ul className="testimonials-grid">
          {list.map((item, i) => (
            <Reveal key={item.id || i} as="li" variant="up" delay={i * 80} className="testimonial-card hover-lift">
              <Quote size={28} className="testimonial-quote-icon" aria-hidden />
              <blockquote>{item.quote}</blockquote>
              <footer>
                <strong>{item.name}</strong>
                {item.role ? <span>{item.role}</span> : null}
              </footer>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
