import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ServiceIcon from "./ServiceIcon.jsx";
import { mediaUrl } from "../utils/mediaUrl.js";
import { recordServiceEngagement } from "../utils/servicePopularity.js";
import Reveal from "./Reveal.jsx";
import "./ServiceCard.css";

export default function ServiceCard({ service, labels, delay = 0, compact = false }) {
  const summary = service.shortDescription || service.description || "";
  const to = `/services/${service.id}`;
  const cardClass = compact ? "service-card service-card--tile" : "service-card";
  const alt = service.imageAlt || service.title;
  const onOpen = () => recordServiceEngagement(service.id, "click");

  return (
    <Reveal delay={delay} className="service-card-wrap">
      <article className={cardClass}>
        <div className="service-card-media">
          <img src={mediaUrl(service.image)} alt={alt} title={alt} className="service-card-image" loading="lazy" />
          <span className="service-card-icon">
            <ServiceIcon name={service.icon} size={compact ? 18 : 22} />
          </span>
          {compact && service.price ? <span className="service-card-price-badge">{service.price}</span> : null}
        </div>
        <div className="service-card-body">
          <p className="service-card-title">
            <Link to={to} onClick={onOpen}>
              {service.title}
            </Link>
          </p>
          {!compact && service.price ? (
            <p className="service-card-price">
              {service.price}
              {service.priceNote ? <span>{service.priceNote}</span> : null}
            </p>
          ) : null}
          {compact && service.priceNote ? <p className="service-card-price-note">{service.priceNote}</p> : null}
          <p className="service-card-summary">{summary}</p>
          <span className="service-card-link">
            {labels?.serviceLearnMore || "View service"}
            <ArrowRight size={15} aria-hidden />
          </span>
        </div>
      </article>
    </Reveal>
  );
}
