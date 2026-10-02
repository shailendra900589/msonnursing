import { useOutletContext } from "react-router-dom";
import { Home, Stethoscope } from "lucide-react";
import Seo from "../components/Seo.jsx";
import Reveal from "../components/Reveal.jsx";
import Btn from "../components/ui/Btn.jsx";

export default function NotFoundPage() {
  const ctx = useOutletContext();
  const labels = ctx?.content?.labels;

  return (
    <div className="container section not-found">
      <Seo
        noindex
        pageKey="notFound"
        title="Page not found | Mson Nursing Services"
        description="This page is not available. Browse home nursing, elder care, and caregiver services in Lucknow."
      />
      <Reveal variant="scale">
        <div className="not-found-icon">
          <Stethoscope size={40} aria-hidden />
        </div>
      </Reveal>
      <Reveal variant="up" delay={80}>
        <h1>{labels?.notFoundTitle}</h1>
        <p className="section-lead">{labels?.notFoundMessage}</p>
        <Btn to="/" icon={Home}>
          {labels?.notFoundButton}
        </Btn>
      </Reveal>
    </div>
  );
}
