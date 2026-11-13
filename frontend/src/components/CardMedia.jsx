import { mediaUrl } from "../utils/mediaUrl.js";
import "./CardMedia.css";

/** Full image, auto height — never crops; frame follows the photo. */
export default function CardMedia({ src, alt, title, className = "", children, width = 800, height = 600 }) {
  const classes = className ? `card-media ${className}` : "card-media";

  return (
    <div className={classes}>
      <img
        className="card-media__img"
        src={mediaUrl(src)}
        alt={alt}
        title={title || alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
      />
      {children}
    </div>
  );
}
