import { mediaUrl } from "../utils/mediaUrl.js";
import "./CardMedia.css";

/**
 * Shows the full image without cropping. A blurred copy fills empty edges
 * so cards stay edge-to-edge on every device and aspect ratio.
 */
export default function CardMedia({ src, alt, title, className = "", children, width = 800, height = 800 }) {
  const url = mediaUrl(src);
  const classes = className ? `card-media ${className}` : "card-media";

  return (
    <div className={classes}>
      <img className="card-media__fill" src={url} alt="" aria-hidden="true" loading="lazy" decoding="async" />
      <img
        className="card-media__img"
        src={url}
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
