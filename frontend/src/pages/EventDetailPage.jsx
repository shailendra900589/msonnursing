import { useMemo, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  Calendar,
  Clock,
  HelpCircle,
  MapPin,
  Megaphone,
  Phone,
  MessageCircle,
  Tent,
} from "lucide-react";
import Seo from "../components/Seo.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Reveal from "../components/Reveal.jsx";
import Btn from "../components/ui/Btn.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";
import EventCard from "../components/EventCard.jsx";
import EventRegistrationForm from "../components/EventRegistrationForm.jsx";
import ShareBar from "../components/ShareBar.jsx";
import { mediaUrl } from "../utils/mediaUrl.js";
import { enrichEventForDisplay, eventFallbackImage } from "../utils/eventDisplay.js";
import { whatsappUrl } from "../utils/whatsapp.js";
import "./EventDetailPage.css";

const TYPE_LABEL = {
  camp: "Health camp",
  campaign: "Campaign",
  event: "Community event",
  drive: "Care drive",
};

function EventHeroImage({ event }) {
  const initial = mediaUrl(event.image) || eventFallbackImage();
  const [src, setSrc] = useState(initial);
  return (
    <img
      src={src}
      alt={event.imageAlt || event.title}
      title={event.imageAlt || event.title}
      className="event-hero-image"
      onError={() => setSrc(eventFallbackImage())}
    />
  );
}

export default function EventDetailPage() {
  const { id } = useParams();
  const { content } = useOutletContext();
  const raw = (content.events || []).find((e) => e.id === id);
  const labels = content.labels;
  const contact = content.contact;
  const city = content.site?.location?.split(",")[0]?.trim() || "Lucknow";
  const phone = contact?.phones?.[0];

  const related = useMemo(() => {
    return (content.events || [])
      .filter((e) => e.published !== false && e.id !== id)
      .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")))
      .slice(0, 4);
  }, [content.events, id]);

  if (!raw || raw.published === false) {
    return (
      <div className="container section center">
        <Seo
          noindex
          title="Event not found | Mson Nursing Services"
          description="This event page is not available. See health camps and nursing campaigns in Lucknow."
        />
        <h1>Event not found</h1>
        <Btn to="/events">{labels?.backToEvents}</Btn>
      </div>
    );
  }

  const event = enrichEventForDisplay(raw, {
    siteName: content.site.name,
    city,
    phone,
  });

  const bodyParts = event.longContent.split(/\n\n+/).filter(Boolean);
  const waLink = whatsappUrl(contact.whatsapp || phone, `Hello, I want to register for: ${event.title}`);

  return (
    <article className="event-page page-enter">
      <Seo pageKey={`event-${event.id}`} event={event} />
      <PageHeader
        title={event.title}
        subtitle={event.shortDescription}
        breadcrumbs={[
          { label: labels?.homeBreadcrumb, to: "/" },
          { label: content.pages.events.title, to: "/events" },
          { label: event.title, to: null },
        ]}
      />

      <section className="event-section event-hero">
        <div className="container">
          <Link to="/events" className="event-back-link">
            <ArrowLeft size={16} aria-hidden /> {labels?.backToEvents || "All events"}
          </Link>
          <div className="event-hero-grid">
            <Reveal variant="scale" className="event-hero-visual hover-lift">
              <EventHeroImage event={event} />
              <span className="event-type-pill">{TYPE_LABEL[event.type] || event.type}</span>
            </Reveal>
            <Reveal variant="right" delay={80} className="event-hero-panel">
              <ul className="event-meta-cards">
                <li>
                  <Calendar size={18} aria-hidden />
                  <div>
                    <strong>Date</strong>
                    <span>
                      {event.date}
                      {event.endDate && event.endDate !== event.date ? ` – ${event.endDate}` : ""}
                    </span>
                  </div>
                </li>
                {event.time ? (
                  <li>
                    <Clock size={18} aria-hidden />
                    <div>
                      <strong>Time</strong>
                      <span>{event.time}</span>
                    </div>
                  </li>
                ) : null}
                <li>
                  <MapPin size={18} aria-hidden />
                  <div>
                    <strong>Location</strong>
                    <span>{event.location}</span>
                  </div>
                </li>
              </ul>
              <p className="event-hero-lead">{event.description}</p>
              <ShareBar pageKey={`event-${event.id}`} event={raw} className="event-share-bar" />
              <div className="event-hero-actions">
                <Btn href="#event-register" pulse>
                  {labels?.eventRegister || "Register interest"}
                </Btn>
                {phone ? (
                  <Btn href={`tel:${phone.replace(/\s/g, "")}`} variant="outline" icon={Phone}>
                    Call {phone}
                  </Btn>
                ) : null}
                {waLink ? (
                  <Btn href={waLink} variant="outline" icon={MessageCircle} target="_blank" rel="noopener noreferrer">
                    WhatsApp
                  </Btn>
                ) : null}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="event-section event-body">
        <div className="container event-body-inner">
          <Reveal variant="up">
            <SectionHeading title="About this program" subtitle={`${content.site.name} · ${city}`} icon={Megaphone} />
            <div className="event-prose">
              {bodyParts.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
          </Reveal>

          <Reveal variant="up" delay={60}>
            <div className="event-split">
              <div className="event-split-col hover-lift">
                <h3>Who should join</h3>
                <ul className="event-check-list">
                  {event.whoFor.map((item) => (
                    <li key={item}>
                      <BadgeCheck size={17} aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="event-split-col hover-lift">
                <h3>Program highlights</h3>
                <ul className="event-check-list">
                  {event.highlights.map((item) => (
                    <li key={item}>
                      <BadgeCheck size={17} aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

        </div>
      </section>

      <section className="event-section event-steps-faq-section">
        <div className="container">
          <Reveal variant="up" delay={90}>
            <div
              className={`event-steps-faq-grid${event.faq?.length ? "" : " event-steps-faq-grid--solo"}`}
            >
              <div className="event-steps-faq-col">
                <SectionHeading
                  title="How it works"
                  subtitle="Simple steps when you connect with us"
                  icon={Clock}
                />
                <ol className="event-agenda">
                  {event.agenda.map((step, i) => (
                    <li key={step.title} className="event-agenda-item hover-lift">
                      <span className="event-agenda-num">{i + 1}</span>
                      <div>
                        <strong>{step.title}</strong>
                        <p>{step.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
              {event.faq?.length ? (
                <div className="event-steps-faq-col">
                  <SectionHeading title="Common questions" icon={HelpCircle} />
                  <div className="event-faq-list">
                    {event.faq.map((item) => (
                      <details key={item.q} className="event-faq-item hover-lift">
                        <summary>{item.q}</summary>
                        <p>{item.a}</p>
                      </details>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </Reveal>
        </div>
      </section>

      {related.length ? (
        <section className="event-section event-related">
          <div className="container">
            <SectionHeading
              title="More events & camps"
              subtitle="Explore other programs from Mson Nursing Services"
              icon={Tent}
            />
            <div className="event-related-grid cards-grid-4">
              {related.map((item, index) => (
                <EventCard key={item.id} event={item} labels={labels} delay={index * 70} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section id="event-register" className="event-section event-register">
        <div className="container event-register-grid">
          <Reveal variant="left">
            <div className="event-register-aside hover-lift">
              <h2>Register for {event.title}</h2>
              <p>
                Tell us your requirement for this {TYPE_LABEL[event.type]?.toLowerCase() || "program"} in {city}. We
                will call you with timing, location details, and home care options if needed.
              </p>
              <ul className="event-register-points">
                <li>
                  <Phone size={16} aria-hidden /> {phone}
                </li>
                <li>
                  <MapPin size={16} aria-hidden /> {event.location}
                </li>
              </ul>
            </div>
          </Reveal>
          <Reveal variant="right" delay={80}>
            <EventRegistrationForm
              contact={contact}
              content={content}
              event={raw}
              labels={labels}
              redirectOnSuccess={false}
            />
          </Reveal>
        </div>
      </section>
    </article>
  );
}
