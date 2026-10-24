import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Bot, Send, X } from "lucide-react";
import { useContent } from "../context/ContentContext.jsx";
import { submitEnquiry } from "../api/client.js";
import { answerCareQuery, getChatQuickPrompts } from "../utils/careChatbot.js";
import { recordServiceEngagement } from "../utils/servicePopularity.js";
import "./CareChatbot.css";

const GENERATE_MS = 2000;

export default function CareChatbot({ open, onClose }) {
  const { content } = useContent();
  const siteName = content?.site?.name || "Mson Nursing Services";
  const quickPrompts = useMemo(() => (content ? getChatQuickPrompts(content) : []), [content]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [leadMode, setLeadMode] = useState(false);
  const [lead, setLead] = useState({ name: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);
  const scrollRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setMessages([
      {
        role: "bot",
        text: `Hi! I am ${siteName} assistant. I read our services, blog, and events to answer your questions. How can we help with home nursing in Lucknow?`,
      },
    ]);
    setLeadMode(false);
    setDone(false);
    setGenerating(false);
    setLead({ name: "", phone: "", message: "" });
    setInput("");
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [open, siteName]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, leadMode, done, generating]);

  const pushBot = (payload) => {
    setMessages((m) => [
      ...m,
      {
        role: "bot",
        text: payload.message,
        links: payload.links,
      },
    ]);
    if (payload.type === "lead") setLeadMode(true);
  };

  const respondToQuery = (text) => {
    const trimmed = text.trim();
    if (!trimmed || !content || generating) return;

    setMessages((m) => [...m, { role: "user", text: trimmed }]);
    setInput("");
    setGenerating(true);
    setLeadMode(false);

    const reply = answerCareQuery(trimmed, content);
    if (reply.type === "lead") {
      setLead((f) => ({ ...f, message: f.message || trimmed }));
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      pushBot(reply);
      setGenerating(false);
    }, GENERATE_MS);
  };

  const onSend = (e) => {
    e.preventDefault();
    respondToQuery(input);
  };

  const onQuickPrompt = (item) => {
    if (item.serviceId) recordServiceEngagement(item.serviceId, "chatbot");
    respondToQuery(item.query);
  };

  const onLeadSubmit = async (e) => {
    e.preventDefault();
    if (!lead.name.trim() || !lead.message.trim()) return;
    setSending(true);
    try {
      await submitEnquiry({
        name: lead.name.trim(),
        phone: lead.phone.trim(),
        message: `[Chatbot enquiry]\n${lead.message.trim()}`,
        sourcePath: window.location.pathname,
        sourcePage: "Care Chatbot",
        formType: "chatbot-lead",
      });
      setDone(true);
      setLeadMode(false);
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text: "Thank you! Your enquiry is submitted. Our team will contact you within 24 hours — any time in that window. You can also call us for urgent care.",
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "bot", text: "Could not submit right now. Please call us directly or try WhatsApp from the chat menu." },
      ]);
    } finally {
      setSending(false);
    }
  };

  if (!open) return null;

  return (
    <div className="care-chatbot-backdrop" role="presentation" onClick={onClose}>
      <div
        className="care-chatbot-panel hover-lift"
        role="dialog"
        aria-label="Care chatbot"
        onClick={(ev) => ev.stopPropagation()}
      >
        <header className="care-chatbot-head">
          <div>
            <Bot size={22} className="care-chatbot-head-icon" aria-hidden />
            <div>
              <strong>{siteName}</strong>
              <span>Care assistant · replies from live site content</span>
            </div>
          </div>
          <button type="button" className="care-chatbot-close" onClick={onClose} aria-label="Close chat">
            <X size={20} />
          </button>
        </header>

        {quickPrompts.length ? (
          <div className="care-chat-quick">
            <span className="care-chat-quick-label">Popular services</span>
            <div className="care-chat-quick-scroll">
              {quickPrompts.map((item) => (
                <button
                  key={item.serviceId || item.label}
                  type="button"
                  className="care-chat-quick-btn"
                  disabled={generating}
                  onClick={() => onQuickPrompt(item)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="care-chatbot-messages" ref={scrollRef}>
          {messages.map((msg, i) => (
            <div key={`${msg.role}-${i}`} className={`care-chat-msg care-chat-msg--${msg.role}`}>
              <p>
                {msg.text.split("\n").map((line, j) => (
                  <span key={j}>
                    {j > 0 ? <br /> : null}
                    {line.split(/(\*\*[^*]+\*\*)/g).map((part, k) =>
                      part.startsWith("**") ? <strong key={k}>{part.slice(2, -2)}</strong> : part
                    )}
                  </span>
                ))}
              </p>
              {msg.links?.length ? (
                <div className="care-chat-links">
                  {msg.links.map((l) => (
                    <Link key={l.to} to={l.to} onClick={onClose}>
                      {l.label} →
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
          {generating ? (
            <div className="care-chat-msg care-chat-msg--bot care-chat-generating" aria-live="polite">
              <span className="care-chat-gen-label">Generating answer</span>
              <span className="care-chat-dots" aria-hidden>
                <span />
                <span />
                <span />
              </span>
            </div>
          ) : null}
        </div>

        {leadMode && !done ? (
          <form className="care-chat-lead" onSubmit={onLeadSubmit}>
            <p className="care-chat-lead-note">Team connects within 24 hours</p>
            <input
              placeholder="Your name *"
              required
              value={lead.name}
              onChange={(e) => setLead((f) => ({ ...f, name: e.target.value }))}
            />
            <input
              placeholder="Mobile / WhatsApp"
              type="tel"
              value={lead.phone}
              onChange={(e) => setLead((f) => ({ ...f, phone: e.target.value }))}
            />
            <textarea
              placeholder="Your care requirement *"
              rows={3}
              required
              value={lead.message}
              onChange={(e) => setLead((f) => ({ ...f, message: e.target.value }))}
            />
            <button type="submit" disabled={sending}>
              {sending ? "Submitting…" : "Submit enquiry"}
            </button>
          </form>
        ) : (
          <form className="care-chat-input-row" onSubmit={onSend}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about services, elder care, prices…"
              aria-label="Message"
              disabled={generating}
            />
            <button type="submit" aria-label="Send" disabled={generating}>
              <Send size={18} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
