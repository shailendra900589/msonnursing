import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

const EMAIL = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;

export function MailMark({ linked = true, icon = false, className = "" }) {
  const image = (
    <img className="mail-mark" src="/email-mark.svg" alt="Email" width={214} height={16} />
  );
  if (!linked) return image;
  return (
    <Link to="/contact" className={className}>
      {icon ? <Mail size={15} aria-hidden /> : null}
      {image}
    </Link>
  );
}

export function SafeText({ text }) {
  const value = String(text ?? "");
  const parts = value.split(/([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})/gi);
  if (parts.length === 1) return value;
  return parts.map((part, index) =>
    EMAIL.test(part) ? <MailMark key={`${index}-${part.length}`} linked={false} /> : part
  );
}
