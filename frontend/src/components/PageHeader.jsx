import { Link } from "react-router-dom";
import { ChevronRight, Plus } from "lucide-react";
import Reveal from "./Reveal.jsx";
import "./PageHeader.css";

export default function PageHeader({ title, subtitle, breadcrumbs = [] }) {
  return (
    <div className="page-header">
      <div className="page-header-pattern" aria-hidden />
      <div className="container page-header-inner">
        {breadcrumbs.length > 0 && (
          <Reveal variant="fade" delay={0}>
            <nav className="breadcrumb" aria-label="Breadcrumb">
              {breadcrumbs.map((crumb, i) => (
                <span key={`${crumb.label}-${i}`} className="breadcrumb-item">
                  {i > 0 && <ChevronRight size={14} className="breadcrumb-chevron" aria-hidden />}
                  {crumb.to ? (
                    <Link to={crumb.to}>{crumb.label}</Link>
                  ) : (
                    <span aria-current="page">{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
          </Reveal>
        )}
        <Reveal variant="up" delay={80}>
          <div className="page-header-title-row">
            <span className="page-header-mark" aria-hidden>
              <Plus size={20} strokeWidth={3} />
            </span>
            <h1>{title}</h1>
          </div>
        </Reveal>
        {subtitle ? (
          <Reveal variant="up" delay={140}>
            <p>{subtitle}</p>
          </Reveal>
        ) : null}
      </div>
      <div className="page-header-wave" aria-hidden />
    </div>
  );
}
