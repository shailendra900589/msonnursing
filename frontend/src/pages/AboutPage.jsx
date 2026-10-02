import { useOutletContext } from "react-router-dom";
import { Building2 } from "lucide-react";
import Seo from "../components/Seo.jsx";
import PageHeader from "../components/PageHeader.jsx";
import WhyChooseGrid from "../components/WhyChooseGrid.jsx";
import CtaBanner from "../components/CtaBanner.jsx";
import Reveal from "../components/Reveal.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";
import { mediaUrl } from "../utils/mediaUrl.js";

export default function AboutPage() {
  const { content } = useOutletContext();
  const page = content.pages.about;
  const block = content.blocks?.about || {};
  const vars = { phone: content.contact.phones[0], siteName: content.site.name };

  return (
    <>
      <Seo pageKey="about" />
      <PageHeader
        title={page.title}
        subtitle={page.subtitle}
        breadcrumbs={[
          { label: content.labels?.homeBreadcrumb, to: "/" },
          { label: page.title, to: null },
        ]}
      />
      <section className="section">
        <div className="container about-page-grid">
          <Reveal variant="left">
            <div className="about-page-media">
              <img src={mediaUrl(page.image)} alt={page.imageAlt} className="hover-lift" />
              <div className="about-year">
                <span>{content.site.established}</span>
                <small>{page.yearBadgeLabel}</small>
              </div>
            </div>
          </Reveal>
          <Reveal variant="right" delay={100}>
            <div>
              <SectionHeading title={content.about.title} icon={Building2} />
              <p className="prose">{content.about.summary}</p>
              <p className="prose">{page.mission}</p>
              <ul className="check-list">
                {content.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section about-promise">
        <div className="container about-promise-grid">
          <Reveal variant="up">
            <article className="about-promise-card">
              <h2>{block.visionTitle}</h2>
              <p>{block.visionText}</p>
            </article>
          </Reveal>
          <Reveal variant="up" delay={100}>
            <article className="about-promise-card">
              <h2>{block.commitmentTitle}</h2>
              <p>{block.commitmentText}</p>
            </article>
          </Reveal>
        </div>
      </section>

      <WhyChooseGrid title={block.valuesTitle} items={block.values} />

      <CtaBanner
        title="Partner with Mson Nursing Services"
        text="Need nurses, attendants or physiotherapy support in Lucknow? Call {{phone}} today."
        buttonLabel="Contact us"
        buttonLink="/contact"
        vars={vars}
      />
    </>
  );
}
