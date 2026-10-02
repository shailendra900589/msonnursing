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
  const onOpen = () => recordServiceEngagement(service.id, "click");

  if (compact) {
    return (
      <Reveal delay={delay} className="service-card-wrap">
        <Link to={to} className={cardClass} aria-label={`Open ${service.title}`} onClick={onOpen}>
          <div className="service-card-media">
            <img src={mediaUrl(service.image)} alt={service.imageAlt || service.title} className="service-card-image" loading="lazy" />
            <span className="service-card-icon">
              <ServiceIcon name={service.icon} size={18} />
            </span>
            {service.price ? <span className="service-card-price-badge">{service.price}</span> : null}
          </div>
          <div className="service-card-body">
            <h3>{service.title}</h3>
            {service.priceNote ? <p className="service-card-price-note">{service.priceNote}</p> : null}
            <p className="service-card-summary">{summary}</p>
            <span className="service-card-link">
              {labels?.serviceLearnMore}
              <ArrowRight size={15} aria-hidden />
            </span>
          </div>
        </Link>
      </Reveal>
    );
  }

  return (
    <Reveal delay={delay} className="service-card-wrap">
      <Link to={to} className={cardClass} aria-label={`Open ${service.title}`} onClick={onOpen}>
        <div className="service-card-media">
          <img src={mediaUrl(service.image)} alt={service.imageAlt || service.title} className="service-card-image" loading="lazy" />
          <span className="service-card-icon">
            <ServiceIcon name={service.icon} size={22} />
          </span>
        </div>
        <div className="service-card-body">
          <h3>{service.title}</h3>
          {service.price ? (
            <p className="service-card-price">
              {service.price}
              {service.priceNote ? <span>{service.priceNote}</span> : null}
            </p>
          ) : null}
          <p className="service-card-summary">{summary}</p>
          <span className="service-card-link">
            {labels?.serviceLearnMore}
            <ArrowRight size={15} aria-hidden />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
