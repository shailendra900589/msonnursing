import { ShieldCheck, Clock, Stethoscope, HeartPulse } from "lucide-react";
import Reveal from "./Reveal.jsx";
import "./TrustStrip.css";

const DEFAULT_ITEMS = [
  { icon: ShieldCheck, label: "Verified nursing staff" },
  { icon: Clock, label: "24/7 enquiry support" },
  { icon: Stethoscope, label: "Clinical-grade home care" },
  { icon: HeartPulse, label: "Lucknow trusted since 2020" },
];

export default function TrustStrip({ items = DEFAULT_ITEMS }) {
  return (
    <section className="trust-strip" aria-label="Trust highlights">
      <div className="container trust-strip-grid">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <Reveal key={item.label} delay={i * 60} className="trust-strip-item hover-lift">
              <span className="trust-strip-icon">
                <Icon size={20} strokeWidth={2} aria-hidden />
              </span>
              <span>{item.label}</span>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
