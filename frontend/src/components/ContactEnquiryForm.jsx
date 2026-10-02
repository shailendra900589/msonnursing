import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Mail, MessageCircle, Phone, Send, User } from "lucide-react";
import Btn from "./ui/Btn.jsx";
import { submitEnquiry } from "../api/client.js";
import { whatsappUrl } from "../utils/whatsapp.js";

export default function ContactEnquiryForm({
  contact,
  form,
  labels,
  sourcePath = "/contact",
  sourcePage = "Contact",
  serviceId = "",
  serviceTitle = "",
  jobId = "",
  jobTitle = "",
  redirectOnSuccess = true,
}) {
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const [fields, setFields] = useState({ name: "", phone: "", message: "" });
  const [resume, setResume] = useState(null);
  const isJob = Boolean(jobId || jobTitle);

  const onResume = (event) => {
    const file = event.target.files?.[0] || null;
    if (!file) {
      setResume(null);
      return;
    }
    const allowed = /\.(pdf|doc|docx)$/i.test(file.name);
    if (!allowed) {
      setResume(null);
      event.target.value = "";
      setStatus("Upload a PDF, DOC, or DOCX resume.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setResume(null);
      event.target.value = "";
      setStatus("Resume must be 5 MB or smaller.");
      return;
    }
    setStatus("");
    setResume(file);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isJob && !resume) {
      setStatus("Upload a PDF, DOC, or DOCX resume.");
      return;
    }
    setSending(true);
    setStatus("");
    try {
      const payload = {
        ...fields,
        sourcePath,
        sourcePage,
        serviceId,
        serviceTitle,
        jobId,
        jobTitle,
      };
      const res = await submitEnquiry(payload, isJob ? resume : null);
      if (redirectOnSuccess) {
        navigate("/enquiry/thanks", {
          state: {
            enquiry: {
              ...payload,
              id: res.id,
              whatsappMessage: `Hello, I am ${fields.name}. Enquiry from ${sourcePage}: ${fields.message}`,
            },
          },
        });
        return;
      }
      setStatus(labels?.enquirySuccess || "Thank you — we received your enquiry and will call you soon.");
      setFields({ name: "", phone: "", message: "" });
      setResume(null);
    } catch (err) {
      setStatus(err.message || labels?.enquiryError || "Could not send. Please call us directly.");
    } finally {
      setSending(false);
    }
  };

  const waLink = whatsappUrl(
    contact.whatsapp || contact.phones?.[0],
    contact.whatsappMessage ||
      `Hello, I am ${fields.name || "a visitor"}. ${fields.message || `I need nursing care — ${serviceTitle || "Lucknow"}.`}`
  );

  return (
    <form className="contact-form-panel hover-lift" onSubmit={onSubmit}>
      <h3>{form.formTitle}</h3>
      {jobTitle || serviceTitle ? (
        <p className="contact-form-service-tag">
          Enquiry for: <strong>{jobTitle || serviceTitle}</strong>
        </p>
      ) : null}
      <label>
        <span className="label-row">
          <User size={16} aria-hidden />
          {form.nameLabel}
        </span>
        <input
          name="name"
          required
          placeholder={form.namePlaceholder}
          value={fields.name}
          onChange={(e) => setFields((f) => ({ ...f, name: e.target.value }))}
        />
      </label>
      <label>
        <span className="label-row">
          <Phone size={16} aria-hidden />
          {form.phoneLabel}
        </span>
        <input
          name="phone"
          type="tel"
          placeholder={form.phonePlaceholder}
          value={fields.phone}
          onChange={(e) => setFields((f) => ({ ...f, phone: e.target.value }))}
        />
      </label>
      {isJob ? (
        <label>
          <span className="label-row">
            <FileText size={16} aria-hidden />
            Resume
          </span>
          <input
            name="resume"
            type="file"
            required
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={onResume}
          />
          <small className="contact-resume-hint">PDF, DOC, or DOCX · up to 5 MB{resume ? ` · ${resume.name}` : ""}</small>
        </label>
      ) : null}
      <label>
        <span className="label-row">
          <Mail size={16} aria-hidden />
          {form.messageLabel}
        </span>
        <textarea
          name="message"
          rows={5}
          required
          placeholder={form.messagePlaceholder}
          value={fields.message}
          onChange={(e) => setFields((f) => ({ ...f, message: e.target.value }))}
        />
      </label>
      <div className="contact-form-actions">
        <Btn type="submit" icon={Send} pulse disabled={sending}>
          {sending ? "Sending…" : form.submitLabel || "Send enquiry"}
        </Btn>
        {waLink ? (
          <Btn href={waLink} variant="outline" icon={MessageCircle} target="_blank" rel="noopener noreferrer">
            {form.whatsappLabel || "WhatsApp instead"}
          </Btn>
        ) : null}
      </div>
      {status ? <p className={`contact-form-status ${status.includes("Thank") ? "ok" : "err"}`}>{status}</p> : null}
    </form>
  );
}
