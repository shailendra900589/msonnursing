import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const TARGETS = [
  "main .page-header",
  "main .section",
  "main .cta-banner",
  "main .trust-strip",
  "main .home-hero",
  "main .section-head",
  "main .section-heading",
  "main .section-intro",
  "main .blog-toolbar",
  "main .services-toolbar",
  "main .services-filter-wrap",
  "main .contact-page-grid > *",
  "main .contact-highlights > *",
  "main .about-page-grid > *",
  "main .about-promise-grid > *",
  "main .job-detail > *",
  "main .enquiry-thanks-card",
  "main .service-product-grid > *",
  "main .event-hero-grid > *",
  "main .split > *",
  "main .home-hero-grid > *",
  "main .card-grid > *",
  "main .posts-grid > *",
  "main .events-grid > *",
  "main .services-catalog-grid > *",
  "main .why-grid > *",
  "main .standards-grid > *",
  "main .process-list > *",
  "main .testimonials-grid > *",
  "main .google-trust-banner",
  "main article:not(.reveal)",
  "main form",
  "main .prose",
  "main .check-list",
  "main .share-bar",
].join(", ");

const VARIANTS = ["up", "fade", "scale", "up", "left", "right"];

function pickVariant(el, index) {
  const forced = el.getAttribute("data-motion");
  if (forced && ["up", "fade", "scale", "left", "right"].includes(forced)) return forced;
  if (el.matches(".page-header, .section-head, .section-heading, .blog-toolbar, .services-toolbar")) {
    return "fade";
  }
  if (el.matches(".home-hero-media-wrap, .about-page-media, img, .service-product-gallery")) {
    return "scale";
  }
  return VARIANTS[index % VARIANTS.length];
}

function shouldSkip(el) {
  if (!el || el.nodeType !== 1) return true;
  if (el.classList.contains("page-motion-ready") || el.classList.contains("reveal")) return true;
  if (el.closest(".reveal")) return true;
  if (el.closest("[data-motion='off']")) return true;
  if (el.getAttribute("aria-hidden") === "true") return true;
  // Avoid animating tiny utility / measurement nodes
  if (el.matches(".services-filter-measure, .skeleton, script, style, noscript")) return true;
  return false;
}

/**
 * Auto-applies professional scroll reveals to sections and key blocks
 * on every public page without hand-wrapping every node.
 */
export default function PageMotion() {
  const { pathname } = useLocation();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.querySelector("main");
    if (!root) return undefined;

    const nodes = [...root.querySelectorAll(TARGETS)].filter((el) => !shouldSkip(el));

    if (reduced) {
      nodes.forEach((el) => el.classList.add("is-visible"));
      return undefined;
    }

    nodes.forEach((el, index) => {
      const variant = pickVariant(el, index);
      const wait = Math.min(30, (index % 8) * 2 + 1);
      el.classList.add("reveal", `reveal-${variant}`, `reveal-wait-${wait}`, "page-motion-ready");
    });

    const show = (el) => el.classList.add("is-visible");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          show(entry.target);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
    );

    const fallbacks = [];
    nodes.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.96 && rect.bottom > 0) {
        show(el);
        return;
      }
      observer.observe(el);
      fallbacks.push(window.setTimeout(() => show(el), 2600));
    });

    return () => {
      observer.disconnect();
      fallbacks.forEach((id) => window.clearTimeout(id));
    };
  }, [pathname]);

  return null;
}
