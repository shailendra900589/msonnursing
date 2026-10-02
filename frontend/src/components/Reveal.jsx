import { useEffect, useRef, useState } from "react";

export default function Reveal({
  children,
  className = "",
  delay = 0,
  variant = "up",
  as: Tag = "div",
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const show = () => setVisible(true);

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.98 && rect.bottom > 0) {
      show();
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px 0px 0px" }
    );
    observer.observe(el);

    const fallback = window.setTimeout(show, 2200);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  const wait = Math.min(30, Math.round((Number(delay) || 0) / 20));

  return (
    <Tag
      ref={ref}
      className={`reveal reveal-${variant} reveal-wait-${wait} ${visible ? "is-visible" : ""} ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
