import { Link } from "react-router-dom";

export default function Btn({
  children,
  to,
  href,
  variant = "primary",
  className = "",
  icon: Icon,
  pulse = false,
  onClick,
  type = "button",
  ...rest
}) {
  const classes = [
    "btn",
    variant === "outline" ? "btn-outline" : "btn-primary",
    pulse ? "btn-pulse" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <>
      {Icon ? <Icon size={18} strokeWidth={2} aria-hidden /> : null}
      <span>{children}</span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {inner}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {inner}
      </a>
    );
  }
  return (
    <button type={type} className={classes} onClick={onClick} {...rest}>
      {inner}
    </button>
  );
}
