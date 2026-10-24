import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, MessageCircle, Phone, Send, User } from "lucide-react";
import Btn from "./ui/Btn.jsx";
import { submitEnquiry } from "../api/client.js";
import { whatsappUrl } from "../utils/whatsapp.js";
import {
  buildCustomFormMessage,
  getEventRegistrationConfig,
  pickNamePhoneFromCustom,
} from "../utils/eventForm.js";

export default function EventRegistrationForm({
  contact,
  content,
  event,
  labels,
  redirectOnSuccess = false,
}) {
  const navigate = useNavigate();
  const config = useMemo(() => getEventRegistrationConfig(event, content), [event, content]);
  const sourcePath = `/events/${event.id}`;
  const sourcePage = `Event: ${event.title}`;

  const initialCustom = useMemo(() => {
    const o = {};
    for (const f of config.fields) o[f.id] = "";
    return o;
  }, [config.fields]);

  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const [defaultFields, setDefaultFields] = useState({ name: "", phone: "", message: "" });
  const [customValues, setCustomValues] = useState(initialCustom);

  useEffect(() => {
    setCustomValues(initialCustom);
  }, [initialCustom]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus("");
    try {
      let payload;
      if (config.useCustom) {
        for (const field of config.fields) {
          if (field.required && !String(customValues[field.id] || "").trim()) {
            setStatus("Please fill all required fields.");
            setSending(false);
            return;
          }
        }
        const { name, phone } = pickNamePhoneFromCustom(config.fields, customValues);
        if (!name && !phone) {
          setStatus("Please include your name or phone number.");
          setSending(false);
          return;
        }
        const message = buildCustomFormMessage(event.title, config.fields, customValues);
        payload = {
          name: name || "Event registrant",
          phone,
          message,
          eventId: event.id,
          eventTitle: event.title,
          formType: "event-custom",
          formResponses: { ...customValues },
          sourcePath,
          sourcePage,
        };
      } else {
        payload = {
          ...defaultFields,
          eventId: event.id,
          eventTitle: event.title,
          formType: "event-default",
          formResponses: {},
          sourcePath,
          sourcePage,
        };
      }

      const res = await submitEnquiry(payload);
      if (redirectOnSuccess) {
        navigate("/enquiry/thanks", {
          state: {
            enquiry: {
              ...payload,
              id: res.id,
              whatsappMessage: `Hello, I registered for ${event.title}. ${payload.message}`,
            },
          },
        });
        return;
      }
      setStatus(labels?.enquirySuccess || "Thank you — registration received. We will call you soon.");
      if (config.useCustom) setCustomValues(initialCustom);
      else setDefaultFields({ name: "", phone: "", message: "" });
    } catch {
      setStatus(labels?.enquiryError || "Could not send. Please call us directly.");
    } finally {
      setSending(false);
    }
  };

  const waMessage =
    config.useCustom && config.fields.length
      ? buildCustomFormMessage(event.title, config.fields, customValues)
      : defaultFields.message || `I want to register for ${event.title}.`;

  const waLink = whatsappUrl(
    contact.whatsapp || contact.phones?.[0],
    `Hello, I am ${defaultFields.name || "a visitor"}. ${waMessage}`
  );

  return (
    <form className="contact-form-panel hover-lift" onSubmit={onSubmit}>
      <h3>{config.formTitle}</h3>
      <p className="contact-form-service-tag">
        Event: <strong>{event.title}</strong>
      </p>

      {config.useCustom ? (
        config.fields.map((field) => (
          <label key={field.id}>
            <span className="label-row">{field.label}{field.required ? " *" : ""}</span>
            {field.type === "textarea" ? (
              <textarea
                rows={4}
                required={!!field.required}
                placeholder={field.placeholder || ""}
                value={customValues[field.id] || ""}
                onChange={(ev) => setCustomValues((v) => ({ ...v, [field.id]: ev.target.value }))}
              />
            ) : field.type === "select" ? (
              <select
                required={!!field.required}
                value={customValues[field.id] || ""}
                onChange={(ev) => setCustomValues((v) => ({ ...v, [field.id]: ev.target.value }))}
              >
                <option value="">{field.placeholder || "Select…"}</option>
                {(field.options || []).map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type === "tel" ? "tel" : field.type === "email" ? "email" : field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                required={!!field.required}
                placeholder={field.placeholder || ""}
                value={customValues[field.id] || ""}
                onChange={(ev) => setCustomValues((v) => ({ ...v, [field.id]: ev.target.value }))}
              />
            )}
          </label>
        ))
      ) : (
        <>
          <label>
            <span className="label-row">
              <User size={16} aria-hidden />
              {config.nameLabel}
            </span>
            <input
              name="name"
              required
              placeholder={config.namePlaceholder}
              value={defaultFields.name}
              onChange={(ev) => setDefaultFields((f) => ({ ...f, name: ev.target.value }))}
            />
          </label>
          <label>
            <span className="label-row">
              <Phone size={16} aria-hidden />
              {config.phoneLabel}
            </span>
            <input
              name="phone"
              type="tel"
              placeholder={config.phonePlaceholder}
              value={defaultFields.phone}
              onChange={(ev) => setDefaultFields((f) => ({ ...f, phone: ev.target.value }))}
            />
          </label>
          <label>
            <span className="label-row">
              <Mail size={16} aria-hidden />
              {config.messageLabel}
            </span>
            <textarea
              name="message"
              rows={5}
              required
              placeholder={config.messagePlaceholder}
              value={defaultFields.message}
              onChange={(ev) => setDefaultFields((f) => ({ ...f, message: ev.target.value }))}
            />
          </label>
        </>
      )}

      <div className="contact-form-actions">
        <Btn type="submit" icon={Send} pulse disabled={sending}>
          {sending ? "Sending…" : config.submitLabel}
        </Btn>
        {waLink ? (
          <Btn href={waLink} variant="outline" icon={MessageCircle} target="_blank" rel="noopener noreferrer">
            {config.whatsappLabel}
          </Btn>
        ) : null}
      </div>
      {status ? <p className={`contact-form-status ${status.includes("Thank") || status.includes("received") ? "ok" : "err"}`}>{status}</p> : null}
    </form>
  );
}
