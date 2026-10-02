import { useEffect, useMemo, useState } from "react";

import { Link, useOutletContext } from "react-router-dom";

import { ArrowRight, BookOpen, CalendarHeart, LayoutGrid, Phone, TrendingUp } from "lucide-react";

import PostCard from "../components/PostCard.jsx";

import Seo from "../components/Seo.jsx";

import ShareBar from "../components/ShareBar.jsx";

import ServiceCard from "../components/ServiceCard.jsx";

import WhyChooseGrid from "../components/WhyChooseGrid.jsx";

import ProcessSteps from "../components/ProcessSteps.jsx";

import CtaBanner from "../components/CtaBanner.jsx";

import EventCard from "../components/EventCard.jsx";

import TrustStrip from "../components/TrustStrip.jsx";

import TestimonialsSection from "../components/TestimonialsSection.jsx";

import Reveal from "../components/Reveal.jsx";

import Btn from "../components/ui/Btn.jsx";

import SectionHeading from "../components/ui/SectionHeading.jsx";

import { applyTemplate } from "../utils/template.js";

import { mediaUrl } from "../utils/mediaUrl.js";

import { pickPopularServices, readServiceStats, recordServiceEngagement } from "../utils/servicePopularity.js";

import "./HomePage.css";



export default function HomePage() {

  const { content } = useOutletContext();

  const home = content.pages.home;

  const block = content.blocks?.home || {};

  const phone = content.contact.phones[0];

  const vars = { siteName: content.site.name, phone };

  const previewText = home.previewIntro?.trim() || home.heroDescription;

  const homeServiceCount = 4;

  const [engagement, setEngagement] = useState({});

  useEffect(() => {
    setEngagement(readServiceStats());
  }, []);

  const popularServices = useMemo(
    () => pickPopularServices(content.services, homeServiceCount, engagement),
    [content.services, engagement]
  );



  const showEvents = block.showOnHome !== false;

  const eventCount = Number(block.homeEventsCount) || 3;

  const homeEvents = (content.events || [])

    .filter((e) => e.published !== false)

    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))

    .slice(0, eventCount);

  const showBlog = block.showBlogOnHome !== false;

  const blogCount = Number(block.homePostsCount) || 3;

  const homePosts = (content.posts || [])

    .filter((p) => p.published !== false)

    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (b.date || "").localeCompare(a.date || ""))

    .slice(0, blogCount);



  return (

    <>

      <Seo pageKey="home" />

      <section className="home-hero">

        <div className="home-hero-bg" aria-hidden />

        <div className="container home-hero-grid">

          <div className="home-hero-copy">

            <p className="eyebrow hero-animate">{home.heroEyebrow}</p>

            <h1 className="hero-animate hero-animate-delay-1">{home.heroTitle}</h1>

            <p className="lead hero-animate hero-animate-delay-2">{home.heroSubtitle}</p>

            <p className="body hero-animate hero-animate-delay-2">{home.heroDescription}</p>

            <div className="actions hero-animate hero-animate-delay-3">

              <Btn to="/contact" icon={ArrowRight} pulse>

                {home.ctaPrimary}

              </Btn>

              <Btn to="/services" variant="outline" icon={LayoutGrid}>

                {home.ctaSecondary}

              </Btn>

            </div>

            <ul className="home-stats hero-animate hero-animate-delay-3">

              {(home.stats || []).map((stat) => (

                <li key={`${stat.value}-${stat.label}`}>

                  <span className="stat-value">{applyTemplate(stat.value, vars)}</span>

                  <span>{stat.label}</span>

                </li>

              ))}

            </ul>

          </div>

          <Reveal variant="scale" delay={120} className="home-hero-media-wrap">

            <div className="home-hero-media">

              <img src={mediaUrl(home.heroImage)} alt={home.heroImageAlt} title={home.heroImageAlt} />

              <div className="home-badge hover-lift">

                <span className="home-badge-icon">{home.trustBadgeIcon}</span>

                <div>

                  <span className="stat-value">{home.trustBadgeTitle}</span>

                  <span>{home.trustBadgeText}</span>

                </div>

              </div>

            </div>

          </Reveal>

        </div>

      </section>



      <Reveal variant="fade" className="home-module">
        <TrustStrip />
      </Reveal>



      <Reveal variant="up" className="home-module">
        <section className="section intro-band">
          <div className="container intro-band-grid">
            <div className="intro-band-main">
              <div className="intro-band-kicker">
                <span className="section-heading-icon" aria-hidden>
                  <LayoutGrid size={20} strokeWidth={2} />
                </span>
                <p className="eyebrow">Home nursing · Lucknow</p>
              </div>
              <h2 className="section-title">{block.introTitle}</h2>
              <p className="section-lead">{block.introText}</p>
            </div>
            <aside className="intro-band-aside">
              <Reveal variant="right" delay={90}>
                <div className="intro-glance-card hover-lift">
                  <p className="intro-glance-title">At a glance</p>
                  <ul className="check-list intro-glance-list">
                    {(content.highlights || []).slice(0, 4).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <Btn to="/about" variant="outline" icon={ArrowRight} className="intro-glance-btn">
                    About the agency
                  </Btn>
                </div>
              </Reveal>
            </aside>
          </div>
        </section>
      </Reveal>



      <Reveal variant="up" delay={20} className="home-module">
        <WhyChooseGrid title={block.whyTitle} subtitle={block.whySubtitle} items={block.whyItems} />
      </Reveal>



      <Reveal variant="up" delay={40} className="home-module">
        <section className="section home-services section-alt">
          <div className="container">
            <Reveal variant="fade" className="section-head">
              <SectionHeading
                title={content.pages.services.title}
                subtitle="Most requested home nursing services — order updates automatically from visitor interest"
                icon={TrendingUp}
              />
              <Btn to="/services" variant="outline" icon={ArrowRight}>
                {content.labels?.allServices}
              </Btn>
            </Reveal>
            <div className="card-grid home-services-grid cards-grid-4">
              {popularServices.slice(0, 4).map((service, i) => (
                <ServiceCard key={service.id} service={service} labels={content.labels} delay={i * 90} compact />
              ))}
            </div>
          </div>
        </section>
      </Reveal>



      {showEvents && homeEvents.length > 0 ? (
        <Reveal variant="up" delay={30} className="home-module">
          <section className="section home-events">
            <div className="container">
              <div className="section-head">
                <SectionHeading
                  title={block.eventsTitle}
                  subtitle={block.eventsSubtitle}
                  icon={CalendarHeart}
                />
                <Btn to="/events" variant="outline" icon={ArrowRight}>
                  All events
                </Btn>
              </div>
              <div className="events-grid cards-grid-4">
                {homeEvents.map((event, i) => (
                  <EventCard key={event.id} event={event} labels={content.labels} delay={i * 90} />
                ))}
              </div>
            </div>
          </section>
        </Reveal>
      ) : null}



      {showBlog && homePosts.length > 0 ? (
        <Reveal variant="up" delay={30} className="home-module">
          <section className="section home-blog section-alt">
            <div className="container">
              <div className="section-head">
                <SectionHeading
                  title={block.blogTitle || "Nursing care blog"}
                  subtitle={block.blogSubtitle}
                  icon={BookOpen}
                />
                <Btn to="/blog" variant="outline" icon={ArrowRight}>
                  All articles
                </Btn>
              </div>
              <div className="posts-grid cards-grid-4">
                {homePosts.map((post, i) => (
                  <PostCard key={post.id} post={post} delay={i * 80} />
                ))}
              </div>
            </div>
          </section>
        </Reveal>
      ) : null}



      <Reveal variant="up" delay={20} className="home-module">
        <section className="section home-about-preview">
          <div className="container home-about-grid">

          <Reveal variant="left" className="home-about-main">

            <h2 className="section-title">{applyTemplate(home.previewTitle, vars)}</h2>

            <p className="section-lead">{previewText}</p>

            <ul className="check-list home-about-checks">

              {content.highlights.map((item) => (

                <li key={item}>{item}</li>

              ))}

            </ul>

            <Btn to="/about" variant="outline" icon={ArrowRight} className="text-link-btn">

              {home.previewLinkText || content.labels?.readOurStory}

            </Btn>

          </Reveal>

          <aside className="home-about-aside">

            <Reveal variant="right" delay={80}>

              <div className="info-card hover-lift">

                <h3>{home.ctaCardTitle}</h3>

                <p>{home.ctaCardText}</p>

                <Btn href={`tel:${phone}`} icon={Phone} pulse>

                  {applyTemplate(home.ctaCardButton, vars)}

                </Btn>

              </div>

            </Reveal>

            <Reveal variant="right" delay={120}>

              <div className="home-popular-panel hover-lift">

                <h3>

                  <TrendingUp size={18} aria-hidden /> Trending services

                </h3>

                <p className="home-popular-hint">Based on clicks & chat enquiries on this device</p>

                <ul>

                  {popularServices.map((s) => (

                    <li key={s.id}>

                      <Link to={`/services/${s.id}`} onClick={() => recordServiceEngagement(s.id, "click")}>
                        {s.title}
                      </Link>

                      {s.price ? <span>{s.price}</span> : null}

                    </li>

                  ))}

                </ul>

                <Btn to="/services" variant="outline" icon={ArrowRight}>

                  View all services

                </Btn>

              </div>

            </Reveal>

          </aside>

          </div>
        </section>
      </Reveal>

      <Reveal variant="up" delay={20} className="home-module">
        <ProcessSteps title={block.processTitle} subtitle={block.processSubtitle} steps={block.processSteps} />
      </Reveal>



      {block.showTestimonials !== false ? (
        <Reveal variant="up" delay={20} className="home-module">
          <TestimonialsSection
            title={block.testimonialsTitle}
            subtitle={block.testimonialsSubtitle}
            items={content.testimonials}
          />
        </Reveal>
      ) : null}

      <section className="container home-module">
        <ShareBar pageKey="home" />
      </section>

      <Reveal variant="scale" delay={40} className="home-module">
        <CtaBanner
          title={block.ctaTitle}
          text={block.ctaText}
          buttonLabel={block.ctaButton}
          buttonLink={block.ctaLink}
          vars={vars}
        />
      </Reveal>

    </>

  );

}


