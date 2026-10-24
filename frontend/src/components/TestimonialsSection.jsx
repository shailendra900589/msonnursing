import { Star, CheckCircle2, ExternalLink } from "lucide-react";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./ui/SectionHeading.jsx";
import "./TestimonialsSection.css";

const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/q3F5gXfbGfDriv6N6";

const AVATAR_COLORS = [
  { bg: "#E0F2FE", text: "#0369A1" },
  { bg: "#FEF3C7", text: "#B45309" },
  { bg: "#DCFCE7", text: "#15803D" },
  { bg: "#FCE7F3", text: "#BE185D" },
  { bg: "#EDE9FE", text: "#6D28D9" },
];

function GoogleIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.66-5.17 3.66-9.09z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.1C3.28 21.43 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.32c-.25-.72-.38-1.49-.38-2.32s.13-1.6.38-2.32V6.57H1.25C.45 8.16 0 9.97 0 12c0 2.03.45 3.84 1.25 5.43l4.03-3.11z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.28 2.57 1.25 6.57l4.03 3.11c.95-2.83 3.6-4.93 6.72-4.93z"
      />
    </svg>
  );
}

function StarRating({ count = 5 }) {
  return (
    <div className="testimonial-stars" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={15}
          fill={i < count ? "#F59E0B" : "none"}
          color={i < count ? "#F59E0B" : "#CBD5E1"}
          strokeWidth={i < count ? 0 : 1.5}
        />
      ))}
    </div>
  );
}

export default function TestimonialsSection({ title, subtitle, items = [] }) {
  const list = items.filter((t) => t.published !== false && t.quote?.trim());
  if (!list.length) return null;

  return (
    <section className="section testimonials-section section-alt" id="testimonials">
      <div className="container">
        <SectionHeading title={title} subtitle={subtitle} icon={Star} />

        {/* Google Trust Banner */}
        <Reveal variant="fade" className="google-trust-banner">
          <div className="google-trust-badge">
            <GoogleIcon size={28} />
            <div className="google-trust-score">
              <div className="google-trust-score-row">
                <span className="google-score-num">5.0</span>
                <StarRating count={5} />
              </div>
              <span className="google-score-meta">
                Based on <strong>93+ Google reviews</strong> · Lucknow
              </span>
            </div>
          </div>
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="google-trust-link"
          >
            <span>View all reviews on Google</span>
            <ExternalLink size={15} aria-hidden="true" />
          </a>
        </Reveal>

        {/* Testimonials Grid */}
        <ul className="testimonials-grid">
          {list.map((item, i) => {
            const initial = (item.name || "U").trim().charAt(0).toUpperCase();
            const colorScheme = AVATAR_COLORS[i % AVATAR_COLORS.length];
            const rating = item.rating || 5;

            return (
              <Reveal
                key={item.id || i}
                as="li"
                variant="up"
                delay={i * 70}
                className="testimonial-card hover-lift"
              >
                <div className="testimonial-card-header">
                  <div
                    className="testimonial-avatar"
                    style={{ backgroundColor: colorScheme.bg, color: colorScheme.text }}
                    aria-hidden="true"
                  >
                    {initial}
                  </div>
                  <div className="testimonial-user-meta">
                    <div className="testimonial-user-name-row">
                      <strong className="testimonial-user-name">{item.name}</strong>
                      <span className="testimonial-verified-badge" title="Verified review">
                        <CheckCircle2 size={13} aria-hidden="true" />
                      </span>
                    </div>
                    {item.role ? (
                      <span className="testimonial-user-role">{item.role}</span>
                    ) : null}
                  </div>
                  <div className="testimonial-google-tag" title="Google review">
                    <GoogleIcon size={16} />
                  </div>
                </div>

                <div className="testimonial-card-rating">
                  <StarRating count={rating} />
                  <span className="testimonial-rating-text">{rating}.0</span>
                </div>

                <blockquote className="testimonial-quote">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
