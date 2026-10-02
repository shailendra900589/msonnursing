import { ArrowRight, HeartPulse } from "lucide-react";
import { applyTemplate } from "../utils/template.js";
import Btn from "./ui/Btn.jsx";
import Reveal from "./Reveal.jsx";
import "./CtaBanner.css";

export default function CtaBanner({ title, text, buttonLabel, buttonLink, vars = {} }) {
  if (!title) return null;
  const isExternal = buttonLink?.startsWith("tel:") || buttonLink?.startsWith("http");
  const label = applyTemplate(buttonLabel, vars);
  const link = applyTemplate(buttonLink, vars);

  return (
    <section className="cta-banner">
      <div className="cta-banner-glow" aria-hidden />
      <div className="container cta-banner-inner">
        <Reveal variant="left">
          <div className="cta-banner-copy">
            <span className="cta-banner-icon">
              <HeartPulse size={22} aria-hidden />
            </span>
            <div>
              <h2>{title}</h2>
              <p>{applyTemplate(text, vars)}</p>
            </div>
          </div>
        </Reveal>
        {buttonLabel && buttonLink ? (
          <Reveal variant="right" delay={100}>
            {isExternal ? (
              <Btn href={link} icon={ArrowRight} pulse>
                {label}
              </Btn>
            ) : (
              <Btn to={link} icon={ArrowRight} pulse>
                {label}
              </Btn>
            )}
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
