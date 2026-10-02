import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Link } from "react-router-dom";
import { BadgeCheck, ChevronDown, Phone, Search, Stethoscope, Users } from "lucide-react";
import Btn from "../components/ui/Btn.jsx";
import { mediaUrl } from "../utils/mediaUrl.js";
import Seo from "../components/Seo.jsx";
import PageHeader from "../components/PageHeader.jsx";
import ServiceCard from "../components/ServiceCard.jsx";
import CtaBanner from "../components/CtaBanner.jsx";
import Reveal from "../components/Reveal.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";
import { SERVICE_CATEGORIES } from "../utils/serviceCategories.js";
import { sortServices } from "../utils/sortServices.js";
import "./ServicesPage.css";

export default function ServicesPage() {
  const { content } = useOutletContext();
  const page = content.pages?.services || { title: "Services", subtitle: "" };
  const block = content.blocks?.services || {};
  const vars = { phone: content.contact.phones[0], siteName: content.site.name };
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(SERVICE_CATEGORIES.length);
  const filterRowRef = useRef(null);
  const filterMeasureRef = useRef(null);

  const city = content.site?.location?.split(",")[0]?.trim() || "Lucknow";
  const introImage =
    block.introImage ||
    content.blocks?.home?.heroImage ||
    sortServices(content.services || [])[0]?.image;

  const services = useMemo(() => {
    let list = sortServices(content.services || []);
    if (category !== "all") list = list.filter((s) => s.category === category);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          (s.shortDescription || "").toLowerCase().includes(q) ||
          (s.price || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [content.services, category, query]);

  useLayoutEffect(() => {
    const row = filterRowRef.current;
    const measure = filterMeasureRef.current;
    if (!row || !measure) return;

    const fit = () => {
      const chips = [...measure.querySelectorAll("[data-filter-chip]")];
      const more = measure.querySelector("[data-filter-more]");
      const gap = parseFloat(getComputedStyle(measure).columnGap || getComputedStyle(measure).gap) || 6;
      const max = row.clientWidth;
      const moreW = more ? more.getBoundingClientRect().width : 72;
      let used = 0;
      let count = chips.length;

      for (let i = 0; i < chips.length; i += 1) {
        const width = chips[i].getBoundingClientRect().width;
        const next = used + (i ? gap : 0) + width;
        const hasMore = i < chips.length - 1;
        if (hasMore && next + gap + moreW > max) {
          count = i;
          break;
        }
        if (!hasMore && next > max) {
          count = Math.max(0, i);
          break;
        }
        used = next;
      }

      setVisibleCount((current) => {
        const nextCount = Math.max(1, count);
        return current === nextCount ? current : nextCount;
      });
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(row);
    return () => observer.disconnect();
  }, []);

  const hasHiddenFilters = visibleCount < SERVICE_CATEGORIES.length;
  const visibleCategories = useMemo(() => {
    if (filtersOpen || !hasHiddenFilters) return SERVICE_CATEGORIES;
    const shown = SERVICE_CATEGORIES.slice(0, visibleCount);
    const activeIndex = SERVICE_CATEGORIES.findIndex((cat) => cat.id === category);
    if (activeIndex >= visibleCount) {
      const active = SERVICE_CATEGORIES[activeIndex];
      return [...shown.slice(0, Math.max(0, shown.length - 1)), active];
    }
    return shown;
  }, [filtersOpen, hasHiddenFilters, visibleCount, category]);

  return (
    <>
      <Seo pageKey="services" />
      <PageHeader
        title={page.title}
        subtitle={page.subtitle}
        breadcrumbs={[
          { label: content.labels?.homeBreadcrumb, to: "/" },
          { label: page.title, to: null },
        ]}
      />
      <section className="section services-intro">
        <div className="container services-intro-grid">
          <Reveal variant="left">
            <SectionHeading title={block.introTitle} subtitle={block.introText} icon={Stethoscope} />
            <div className="services-intro-actions">
              <Btn to="/contact" pulse>
                {content.labels?.serviceBook || "Book care"}
              </Btn>
              <Btn href={`tel:${content.contact.phones[0]?.replace(/\s/g, "")}`} variant="outline" icon={Phone}>
                {content.contact.phones[0]}
              </Btn>
            </div>
            <ul className="services-intro-highlights">
              {(block.standards || []).slice(0, 3).map((item) => (
                <li key={item}>
                  <BadgeCheck size={17} aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal variant="right" delay={90} className="services-intro-visual">
            <div className="services-intro-image-wrap hover-lift">
              {introImage ? (
                <img
                  src={mediaUrl(introImage)}
                  alt={block.introImageAlt || content.pages?.home?.heroImageAlt || "Nurse providing home care in Lucknow"}
                  className="services-intro-image"
                />
              ) : null}
              <div className="services-intro-stats">
                <div>
                  <strong>{(content.services || []).length}+</strong>
                  <span>Services listed</span>
                </div>
                <div>
                  <strong>
                    <Users size={18} aria-hidden />
                  </strong>
                  <span>Male & female staff</span>
                </div>
                <div>
                  <strong>{city}</strong>
                  <span>Home visits</span>
                </div>
              </div>
            </div>
            <p className="services-intro-note">
              Browse by category below or{" "}
              <Link to="/contact">contact us</Link> for a custom care plan.
            </p>
          </Reveal>
        </div>
      </section>
      <section className="section services-toolbar-section">
        <div className="container">
          <div className="services-toolbar">
            <label className="services-search">
              <Search size={18} aria-hidden />
              <input
                type="search"
                placeholder="Search services or price…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <p className="services-count">
              Showing <strong>{services.length}</strong> of {(content.services || []).length} services
            </p>
          </div>
          <div className="services-filter-wrap">
            <div className="services-filter-measure" ref={filterMeasureRef} aria-hidden="true">
              {SERVICE_CATEGORIES.map((cat) => (
                <button key={cat.id} type="button" data-filter-chip tabIndex={-1}>
                  {cat.label}
                </button>
              ))}
              <button type="button" data-filter-more tabIndex={-1}>
                More
              </button>
            </div>
            <div
              className={`services-filter${filtersOpen ? " is-open" : ""}`}
              ref={filterRowRef}
              role="group"
              aria-label="Service categories"
            >
              {visibleCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={category === cat.id ? "active" : ""}
                  onClick={() => setCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
              {hasHiddenFilters ? (
                <button
                  type="button"
                  className={`services-filter-more${filtersOpen ? " is-open" : ""}`}
                  aria-expanded={filtersOpen}
                  onClick={() => setFiltersOpen((open) => !open)}
                >
                  {filtersOpen ? "Less" : "More"}
                  <ChevronDown size={14} aria-hidden />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </section>
      <section className="section services-catalog-section">
        <div className="container">
          {services.length ? (
            <div className="services-catalog-grid cards-grid-4">
              {services.map((service, i) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  labels={content.labels}
                  delay={Math.min(i, 10) * 35}
                  compact
                />
              ))}
            </div>
          ) : (
            <p className="section-lead">No services match your search. Try another category or clear filters.</p>
          )}
        </div>
      </section>
      <section className="section standards-section section-alt">
        <div className="container">
          <Reveal variant="up">
            <h2 className="section-title">{block.standardsTitle}</h2>
          </Reveal>
          <div className="standards-grid">
            {(block.standards || []).map((item, i) => (
              <Reveal key={item} variant="up" delay={i * 50} className="standards-card hover-lift">
                <BadgeCheck size={18} aria-hidden />
                <p>{item}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CtaBanner
        title="Book nursing staff in Lucknow"
        text="Male/female nurses, attendants, baby & elder care — {{phone}}"
        buttonLabel="Get in Touch"
        buttonLink="/contact"
        vars={vars}
      />
    </>
  );
}
