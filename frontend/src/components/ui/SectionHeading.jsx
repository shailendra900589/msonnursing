import Reveal from "../Reveal.jsx";

export default function SectionHeading({
  title,
  subtitle,
  align = "left",
  icon: Icon,
  delay = 0,
}) {
  if (!title) return null;
  return (
    <Reveal delay={delay} className={`section-heading align-${align}`}>
      {Icon ? (
        <div className="section-heading-icon">
          <Icon size={22} strokeWidth={2} aria-hidden />
        </div>
      ) : null}
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle ? <p className="section-lead">{subtitle}</p> : null}
      </div>
    </Reveal>
  );
}
