import { Instagram, Youtube } from "lucide-react";
import { socialProfiles } from "../utils/socialLinks.js";
import "./SocialLinks.css";

const ICONS = {
  instagram: Instagram,
  youtube: Youtube,
};

export default function SocialLinks({ contact, className = "" }) {
  const profiles = socialProfiles(contact);
  if (!profiles.length) return null;

  return (
    <div className={`social-links ${className}`.trim()}>
      {profiles.map((item) => {
        const Icon = ICONS[item.id];
        return (
          <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer">
            {Icon ? <Icon size={16} aria-hidden /> : null}
            <span>{item.label}</span>
          </a>
        );
      })}
    </div>
  );
}
