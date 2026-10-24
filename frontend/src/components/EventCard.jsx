import { Link } from "react-router-dom";
import { Calendar, MapPin, Clock } from "lucide-react";
import { mediaUrl } from "../utils/mediaUrl.js";
import Reveal from "./Reveal.jsx";
import "./EventCard.css";

const TYPE_LABEL = {
  camp: "Health camp",
  campaign: "Campaign",
  event: "Event",
  drive: "Care drive",
};

export default function EventCard({ event, labels, delay = 0 }) {
  const typeClass = `event-type-${event.type === "campaign" ? "campaign" : event.type === "camp" ? "camp" : "event"}`;

  return (
    <Reveal delay={delay} className="event-card-wrap">
      <article className="event-card hover-lift">
        <div className="event-card-media">
          <img src={mediaUrl(event.image)} alt={event.imageAlt || event.title} title={event.imageAlt || event.title} width={640} height={360} loading="lazy" />
          {event.featured ? <span className="event-featured">{labels?.eventFeatured || "Featured"}</span> : null}
        </div>
        <div className="event-card-body">
          <span className={`event-type-badge ${typeClass}`}>{TYPE_LABEL[event.type] || event.type}</span>
          <p className="event-card-title">{event.title}</p>
          <p>{event.shortDescription}</p>
          <ul className="event-meta">
            <li>
              <Calendar size={16} /> {event.date}
              {event.endDate && event.endDate !== event.date ? ` – ${event.endDate}` : ""}
            </li>
            {event.time ? (
              <li>
                <Clock size={16} /> {event.time}
              </li>
            ) : null}
            <li>
              <MapPin size={16} /> {event.location}
            </li>
          </ul>
          <Link to={`/events/${event.id}`} className="event-card-link">
            {labels?.eventLearnMore}
          </Link>
        </div>
      </article>
    </Reveal>
  );
}
