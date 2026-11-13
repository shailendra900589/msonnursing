import { mediaUrl } from "../utils/mediaUrl.js";
import "./CardMedia.css";

/** Edge-to-edge card image — cover fill, consistent frame on every device. */
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
