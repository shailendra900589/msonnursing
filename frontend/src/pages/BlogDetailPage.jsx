import { useMemo } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, Calendar, HelpCircle, Phone, Stethoscope, User } from "lucide-react";
import Seo from "../components/Seo.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Reveal from "../components/Reveal.jsx";
import Btn from "../components/ui/Btn.jsx";
import ShareBar from "../components/ShareBar.jsx";
import PostCard from "../components/PostCard.jsx";
import ServiceCard from "../components/ServiceCard.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";
import { SafeText } from "../components/MailMark.jsx";
import { mediaUrl } from "../utils/mediaUrl.js";
import { formatPhone } from "../utils/phone.js";
import { getPostFaq, pickRelatedPosts, pickRelatedServices } from "../utils/blogRelated.js";
import "./BlogDetailPage.css";

function readingMinutes(body = "") {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 180));
}

export default function BlogDetailPage() {
  const { id } = useParams();
  const { content } = useOutletContext();
  const post = (content.posts || []).find((p) => p.id === id);
  const labels = content.labels;
  const phone = content.contact?.phones?.[0];

  const relatedPosts = useMemo(
    () => pickRelatedPosts(content.posts, id, 8),
    [content.posts, id]
  );

  const relatedServices = useMemo(
    () => pickRelatedServices(content.services, post, 4),
    [content.services, post]
  );

  if (!post || post.published === false) {
    return (
      <div className="container section center">
        <Seo
          noindex
          title="Article not found | Mson Nursing Services"
          description="This article is not available. Read home nursing and elder care guides from Mson Nursing Services."
        />
        <h1>Article not found</h1>
        <Btn to="/blog">{labels?.backToBlog || "Back to blog"}</Btn>
      </div>
    );
  }

  const faq = getPostFaq(post, content.site?.name, phone);
  const paragraphs = (post.body || "").split(/\n\n+/).filter(Boolean);
  const readMin = readingMinutes(post.body || post.excerpt);

  return (
    <article className="blog-page page-enter">
      <Seo pageKey={`post-${post.id}`} post={{ ...post, faq }} />
      <PageHeader
        title={post.title}
        subtitle={post.excerpt}
        breadcrumbs={[
          { label: labels?.homeBreadcrumb, to: "/" },
          { label: content.pages?.blog?.title || "Blog", to: "/blog" },
          { label: post.title, to: null },
        ]}
      />

      <section className="blog-section blog-hero-body">
        <div className="container">
          <Link to="/blog" className="blog-back-link">
            <ArrowLeft size={16} aria-hidden /> {labels?.backToBlog || "All articles"}
          </Link>
          <div className="blog-article-layout">
            <div className="blog-article-main">
              <Reveal variant="up">
                {post.image ? (
                  <figure className="blog-featured-figure hover-lift">
                    <img src={mediaUrl(post.image)} alt={post.imageAlt || post.title} title={post.imageAlt || post.title} className="blog-featured-image" width={960} height={540} />
                  </figure>
                ) : null}
                <ul className="blog-meta-chips">
                  {post.date ? (
                    <li>
                      <Calendar size={15} aria-hidden /> {post.date}
                    </li>
                  ) : null}
                  {post.author ? (
                    <li>
                      <User size={15} aria-hidden /> {post.author}
                    </li>
                  ) : null}
                  {post.category ? (
                    <li>
                      <BookOpen size={15} aria-hidden /> {post.category}
                    </li>
                  ) : null}
                  <li>{readMin} min read</li>
                </ul>
              </Reveal>

              <Reveal variant="up" delay={60}>
                <div className="prose blog-article-body">
                  {paragraphs.map((para) => (
                    <p key={para.slice(0, 48)}><SafeText text={para} /></p>
                  ))}
                </div>
              </Reveal>
            </div>

            <aside className="blog-aside">
              <Reveal variant="left" delay={80}>
                <div className="blog-aside-cta hover-lift">
                  <h2>Home nursing, home care and elder care</h2>
                  <p>
                    Mson Nursing Services is a nursing agency in Lucknow for nursing care and GDA male attendants.
                  </p>
                  {phone ? (
                    <p className="blog-aside-phone">
                      <Phone size={16} aria-hidden /> {formatPhone(phone)}
                    </p>
                  ) : null}
                  <Btn to="/contact" pulse>
                    {content.header?.navCtaLabel || "Get in Touch"}
                  </Btn>
                  <Btn to="/services" variant="outline">
                    View services
                  </Btn>
                </div>
              </Reveal>

              {faq.length ? (
                <Reveal variant="left" delay={95}>
                  <div className="blog-aside-faq hover-lift">
                    <div className="blog-aside-faq-head">
                      <span className="blog-aside-faq-icon" aria-hidden>
                        <HelpCircle size={18} />
                      </span>
                      <h2>Common questions</h2>
                    </div>
                    <div className="blog-aside-faq-list">
                      {faq.map((item, i) => (
                        <details key={item.q} className="blog-aside-faq-item" open={i === 0}>
                          <summary>{item.q}</summary>
                          <p>{item.a}</p>
                        </details>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ) : null}

              <Reveal variant="left" delay={110}>
                <ShareBar
                  pageKey={`post-${post.id}`}
                  post={post}
                  className="blog-share-aside share-bar--stack-end"
                />
              </Reveal>
            </aside>
          </div>
        </div>
      </section>

      {relatedServices.length ? (
        <section className="blog-section blog-related-services">
          <div className="container">
            <SectionHeading title="Related nursing services" subtitle="Book care mentioned in this article" icon={Stethoscope} />
            <div className="blog-services-grid cards-grid-4">
              {relatedServices.map((service, i) => (
                <ServiceCard key={service.id} service={service} labels={labels} delay={i * 60} compact />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {relatedPosts.length ? (
        <section className="blog-section blog-related-posts">
          <div className="container">
            <SectionHeading title="Related articles" subtitle="Up to 8 guides from our nursing blog" icon={BookOpen} />
            <div className="blog-related-posts-grid posts-grid cards-grid-4">
              {relatedPosts.map((item, i) => (
                <PostCard key={item.id} post={item} delay={i * 50} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </article>
  );
}
