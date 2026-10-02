import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { CalendarHeart, Megaphone, Tent } from "lucide-react";
import Seo from "../components/Seo.jsx";
import PageHeader from "../components/PageHeader.jsx";
import EventCard from "../components/EventCard.jsx";
import Reveal from "../components/Reveal.jsx";
import CtaBanner from "../components/CtaBanner.jsx";

const FILTERS = [
  { id: "all", labelKey: "eventAllTypes", icon: CalendarHeart },
  { id: "camp", label: "Camps", icon: Tent },
  { id: "campaign", label: "Campaigns", icon: Megaphone },
  { id: "event", label: "Events", icon: CalendarHeart },
];

export default function EventsPage() {
  const { content } = useOutletContext();
  const page = content.pages.events;
  const labels = content.labels;
  const [filter, setFilter] = useState("all");
  const vars = { phone: content.contact.phones[0], siteName: content.site.name };

  const events = useMemo(() => {
    const list = (content.events || []).filter((e) => e.published !== false);
    if (filter === "all") return list;
    return list.filter((e) => e.type === filter);
  }, [content.events, filter]);

  return (
    <>
      <Seo pageKey="events" />
      <PageHeader
        title={page.title}
        subtitle={page.subtitle}
        breadcrumbs={[
          { label: labels?.homeBreadcrumb, to: "/" },
          { label: page.title, to: null },
        ]}
      />
      <section className="section">
        <div className="container">
          <Reveal variant="up">
            <div className="events-filter">
              {FILTERS.map((f) => {
                const Icon = f.icon;
                return (
                  <button
                    key={f.id}
                    type="button"
                    className={filter === f.id ? "active" : ""}
                    onClick={() => setFilter(f.id)}
                  >
                    <Icon size={16} aria-hidden />
                    {f.label || labels?.[f.labelKey] || f.id}
                  </button>
                );
              })}
            </div>
          </Reveal>
          <div className="events-grid cards-grid-4">
            {events.map((event, i) => (
              <EventCard key={event.id} event={event} labels={labels} delay={i * 80} />
            ))}
          </div>
          {events.length === 0 ? (
            <Reveal variant="fade">
              <p className="section-lead">No events in this category right now. Please check back soon.</p>
            </Reveal>
          ) : null}
        </div>
      </section>
      <CtaBanner
        title="Want to host a camp with us?"
        text="Partner with Mson Nursing Services for health camps and community care drives in Lucknow. Call {{phone}}."
        buttonLabel="Contact team"
        buttonLink="/contact"
        vars={vars}
      />
    </>
  );
}
