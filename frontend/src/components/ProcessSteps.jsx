import { ClipboardList, Users, UserCheck, Headphones } from "lucide-react";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./ui/SectionHeading.jsx";
import "./ProcessSteps.css";

const STEP_ICONS = [ClipboardList, Users, UserCheck, Headphones];

export default function ProcessSteps({ title, subtitle, steps = [] }) {
  if (!steps.length) return null;
  return (
    <section className="section process-section">
      <div className="container">
        <SectionHeading title={title} subtitle={subtitle} align="center" icon={ClipboardList} />
        <ol className="process-list">
          {steps.map((step, index) => {
            const Icon = STEP_ICONS[index % STEP_ICONS.length];
            return (
              <Reveal as="li" key={step.step} delay={index * 90} variant="up" className="hover-lift">
                <div className="process-top">
                  <span className="process-num">{step.step}</span>
                  <span className="process-icon">
                    <Icon size={18} aria-hidden />
                  </span>
                </div>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
