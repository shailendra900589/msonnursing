import { Link } from "react-router-dom";
import { Calendar, User } from "lucide-react";
import { mediaUrl } from "../utils/mediaUrl.js";
import Reveal from "./Reveal.jsx";
import "./PostCard.css";

export default function PostCard({ post, delay = 0 }) {
  return (
    <Reveal delay={delay} className="post-card-wrap">
      <article className="post-card hover-lift">
        {post.image ? <img src={mediaUrl(post.image)} alt={post.imageAlt || post.title} title={post.imageAlt || post.title} className="post-card-image" loading="lazy" /> : null}
        <div className="post-card-body">
          {post.category ? <span className="post-card-category">{post.category}</span> : null}
          <p className="post-card-title">
            <Link to={`/blog/${post.id}`}>{post.title}</Link>
          </p>
          <p>{post.excerpt}</p>
          <div className="post-card-meta">
            {post.date ? (
              <span>
                <Calendar size={14} aria-hidden /> {post.date}
              </span>
            ) : null}
            {post.author ? (
              <span>
                <User size={14} aria-hidden /> {post.author}
              </span>
            ) : null}
          </div>
        </div>
      </article>
    </Reveal>
  );
}
