import { useState } from "react";
import { Bot, Mail, MessageCircle, Phone, MessagesSquare, X } from "lucide-react";
import { useContent } from "../context/ContentContext.jsx";
import { whatsappUrl } from "../utils/whatsapp.js";
import CareChatbot from "./CareChatbot.jsx";
import "./FloatingCareBar.css";

const MENU = [
  { id: "bot", label: "Chatbot", Icon: Bot, className: "floating-care-item--bot" },
  { id: "email", label: "Email", Icon: Mail, className: "floating-care-item--email" },
  { id: "whatsapp", label: "WhatsApp", Icon: MessageCircle, className: "floating-care-item--whatsapp" },
  { id: "call", label: "Call", Icon: Phone, className: "floating-care-item--call" },
];

export default function FloatingCareBar() {
  const { content } = useContent();
  const [open, setOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const phone = content?.contact?.phones?.[0];
  const email = content?.contact?.email;
  const waNumber = content?.contact?.whatsapp || phone;
  const waLink = whatsappUrl(waNumber, content?.contact?.whatsappMessage);
  const mailLink = email
    ? `mailto:${email}?subject=${encodeURIComponent(`Enquiry — ${content?.site?.name || "Mson Nursing Services"}`)}`
    : "";

  const onItemClick = (id) => {
    if (id === "bot") {
      setChatOpen(true);
      setOpen(false);
      return;
    }
    setOpen(false);
  };

  if (!phone && !waLink && !email) return null;

  return (
    <>
      <CareChatbot open={chatOpen} onClose={() => setChatOpen(false)} />

      <div className={`floating-care-hub ${open ? "floating-care-hub--open" : ""}`} aria-label="Quick contact">
        <div className="floating-care-menu" aria-hidden={!open}>
          {MENU.map((item, i) => {
            const { Icon } = item;
            if (item.id === "whatsapp" && !waLink) return null;
            if (item.id === "call" && !phone) return null;
            if (item.id === "email" && !mailLink) return null;

            const style = { "--care-i": i };
            const inner = (
              <>
                <span className="floating-care-item-icon">
                  <Icon size={22} aria-hidden />
                </span>
                <span className="floating-care-item-label">{item.label}</span>
              </>
            );

            if (item.id === "bot") {
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`floating-care-item ${item.className}`}
                  style={style}
                  aria-label={item.label}
                  onClick={() => onItemClick("bot")}
                >
                  {inner}
                </button>
              );
            }
            if (item.id === "email") {
              return (
                <a
                  key={item.id}
                  href={mailLink}
                  className={`floating-care-item ${item.className}`}
                  style={style}
                  aria-label={item.label}
                  onClick={() => onItemClick("email")}
                >
                  {inner}
                </a>
              );
            }
            if (item.id === "whatsapp") {
              return (
                <a
                  key={item.id}
                  href={waLink}
                  className={`floating-care-item ${item.className}`}
                  style={style}
                  aria-label={item.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onItemClick("whatsapp")}
                >
                  {inner}
                </a>
              );
            }
            return (
              <a
                key={item.id}
                href={`tel:${phone.replace(/\s/g, "")}`}
                className={`floating-care-item ${item.className}`}
                style={style}
                aria-label={`Call ${phone}`}
                onClick={() => onItemClick("call")}
              >
                {inner}
              </a>
            );
          })}
        </div>

        <button
          type="button"
          className="floating-care-trigger"
          aria-expanded={open}
          aria-label={open ? "Close contact menu" : "Open contact menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="floating-care-trigger-ring" aria-hidden />
          {open ? <X size={22} aria-hidden /> : <MessagesSquare size={22} aria-hidden />}
          <span className="floating-care-item-label">{open ? "Close" : "Chat"}</span>
        </button>
      </div>
    </>
  );
}
