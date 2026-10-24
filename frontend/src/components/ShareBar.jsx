import { useEffect, useMemo, useState } from "react";
import { Copy, Facebook, Link2, MessageCircle, Share2 } from "lucide-react";
import { useContent } from "../context/ContentContext.jsx";
import { resolveShareMeta } from "../utils/shareMeta.js";
import { whatsappUrl } from "../utils/whatsapp.js";
import "./ShareBar.css";

export default function ShareBar({ pageKey, service, event, post, className = "", hideCta = false }) {
  const { content } = useContent();
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
    setHydrated(true);
  }, []);

  const meta = useMemo(
    () => resolveShareMeta({ content, pageKey, service, event, post }),
    [content, pageKey, service, event, post]
  );

  if (!meta) return null;

  const url = hydrated ? window.location.href : meta.canonical;

  const waLink = whatsappUrl(
    content?.contact?.whatsapp || meta.phone,
    `${meta.shareTitle}\n${meta.shareText}\n${url}`
  );

  const fbShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const twitterShare = `https://twitter.com/intent/tweet?text=${encodeURIComponent(meta.shareTitle)}&url=${encodeURIComponent(url)}`;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const onNativeShare = async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({
        title: meta.shareTitle,
        text: meta.shareText,
        url,
      });
    } catch {
      /* cancelled */
    }
  };

  return (
    <div className={`share-bar ${className}`.trim()} role="group" aria-label="Share this page">
      <div className="share-bar-copy">
        <strong>Share</strong>
        {hideCta ? null : (
          <span className="share-bar-cta-pill">{meta.ctaLabel}: {meta.phone}</span>
        )}
      </div>
      <div className="share-bar-actions">
        {canNativeShare ? (
          <button type="button" className="share-btn share-btn-primary" onClick={onNativeShare}>
            <Share2 size={16} aria-hidden /> Share
          </button>
        ) : null}
        {waLink ? (
          <a className="share-btn share-btn-wa" href={waLink} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={16} aria-hidden /> WhatsApp
          </a>
        ) : null}
        <a className="share-btn" href={fbShare} target="_blank" rel="noopener noreferrer">
          <Facebook size={16} aria-hidden /> Facebook
        </a>
        <a className="share-btn" href={twitterShare} target="_blank" rel="noopener noreferrer">
          <Link2 size={16} aria-hidden /> X / Twitter
        </a>
        <button type="button" className="share-btn" onClick={onCopy}>
          <Copy size={16} aria-hidden /> {copied ? "Copied!" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
