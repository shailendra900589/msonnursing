import { useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  CalendarHeart,
  Eye,
  EyeOff,
  FileText,
  Inbox,
  LockKeyhole,
  Stethoscope,
  ClipboardList,
} from "lucide-react";
import { adminFetchEnquiries, adminUpdatePassword } from "../api/client.js";

function hasText(value) {
  return String(value || "").trim().length > 0;
}

function isJobApplication(row) {
  return hasText(row.jobId) || hasText(row.jobTitle);
}

function isValidEnquiry(row) {
  return hasText(row.name) && (hasText(row.message) || hasText(row.phone));
}

function formatToday() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function MetricCard({ tone, icon, label, value, badge, note, onClick }) {
  return (
    <button type="button" className={`master-card master-card--${tone}`} onClick={onClick}>
      <span className="master-card-top">
        <span className="master-card-label">{label}</span>
        <span className="master-card-icon" aria-hidden>
          {icon}
        </span>
      </span>
      <strong>{value}</strong>
      {badge ? <em className={`master-badge master-badge--${badge.tone}`}>{badge.text}</em> : <span className="master-badge-gap" />}
      <span className="master-card-note">{note}</span>
    </button>
  );
}

function PipelineRow({ label, value, max, tone }) {
  const width = max > 0 ? Math.max(value > 0 ? 8 : 0, Math.round((value / max) * 100)) : 0;
  return (
    <div className="master-pipe-row">
      <div className="master-pipe-label">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="master-pipe-track" aria-hidden>
        <span className={`master-pipe-fill master-pipe-fill--${tone}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

export default function AdminOverview({ token, data, onOpen, onOpenLeads }) {
  const [enquiries, setEnquiries] = useState([]);
  const [loadingForms, setLoadingForms] = useState(true);
  const [error, setError] = useState("");
  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    let cancelled = false;
    adminFetchEnquiries(token)
      .then((rows) => {
        if (!cancelled) setEnquiries(Array.isArray(rows) ? rows : []);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load form submissions. Check that the API is running.");
      })
      .finally(() => {
        if (!cancelled) setLoadingForms(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const posts = data?.posts || [];
  const events = data?.events || [];
  const services = data?.services || [];
  const jobs = data?.jobs || [];
  const siteName = data?.site?.name || "Mson Nursing Services";

  const counts = useMemo(() => {
    const applications = enquiries.filter(isJobApplication).length;
    const valid = enquiries.filter(isValidEnquiry).length;
    const general = enquiries.length - applications;
    const openJobs = jobs.filter((job) => job.published !== false).length;
    const livePosts = posts.filter((post) => post.published !== false).length;
    const liveEvents = events.filter((item) => item.published !== false).length;
    return {
      leads: enquiries.length,
      valid,
      applications,
      general: Math.max(0, general),
      openJobs,
      livePosts,
      draftPosts: posts.length - livePosts,
      liveEvents,
      draftEvents: events.length - liveEvents,
      services: services.length,
    };
  }, [enquiries, jobs, posts, events, services]);

  const display = (value) => (loadingForms ? "…" : value);
  const pipeMax = Math.max(counts.leads, counts.valid, counts.applications, 1);

  const changePassword = async (event) => {
    event.preventDefault();
    setPasswordStatus("");
    setPasswordError("");
    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }
    setSavingPassword(true);
    try {
      await adminUpdatePassword(token, passwordForm.current, passwordForm.next);
      setPasswordForm({ current: "", next: "", confirm: "" });
      setPasswordStatus("Password updated. Use it the next time you sign in.");
    } catch (err) {
      setPasswordError(err.message || "Could not update password.");
    } finally {
      setSavingPassword(false);
    }
  };

  const actions = [
    { label: "Review Leads", icon: <Inbox size={16} />, onClick: onOpenLeads },
    { label: "Manage Jobs", icon: <Briefcase size={16} />, onClick: () => onOpen("jobs") },
    { label: "Write Blog", icon: <FileText size={16} />, onClick: () => onOpen("pages", "blog") },
    { label: "Events", icon: <CalendarHeart size={16} />, onClick: () => onOpen("pages", "events") },
    { label: "Services", icon: <Stethoscope size={16} />, onClick: () => onOpen("pages", "services") },
  ];

  const links = [
    { label: "All enquiries", onClick: onOpenLeads },
    { label: "Job posts", onClick: () => onOpen("jobs") },
    { label: "Edit pages", onClick: () => onOpen("pages", "home") },
    { label: "Media library", onClick: () => onOpen("media") },
    { label: "SEO & labels", onClick: () => onOpen("seo") },
    { label: "Site & colors", onClick: () => onOpen("site") },
  ];

  return (
    <div className="master-dash">
      <section className="master-hero">
        <div className="master-hero-copy">
          <p>Mson CMS</p>
          <h2>Master Dashboard</h2>
          <span>
            {siteName} · {formatToday()}
          </span>
        </div>
        <div className="master-hero-stats">
          <button type="button" onClick={onOpenLeads}>
            <strong>{display(counts.leads)}</strong>
            <span>New leads</span>
          </button>
          <button type="button" onClick={onOpenLeads}>
            <strong>{display(counts.valid)}</strong>
            <span>Valid enquiries</span>
          </button>
          <button type="button" onClick={onOpenLeads}>
            <strong>{display(counts.applications)}</strong>
            <span>Applications</span>
          </button>
          <button type="button" onClick={() => onOpen("jobs")}>
            <strong>{counts.openJobs}</strong>
            <span>Open roles</span>
          </button>
        </div>
      </section>

      <div className="master-actions">
        {actions.map((action) => (
          <button key={action.label} type="button" onClick={action.onClick}>
            {action.icon}
            {action.label}
          </button>
        ))}
      </div>

      {error ? <p className="admin-form-note admin-form-note--error">{error}</p> : null}

      <div className="master-layout">
        <div className="master-main-col">
          <p className="master-section">Leads & content</p>
          <div className="master-cards">
            <MetricCard
              tone="amber"
              icon={<Inbox size={18} />}
              label="New leads"
              value={display(counts.leads)}
              badge={
                !loadingForms && counts.leads > 0
                  ? { text: "Action needed", tone: "warn" }
                  : !loadingForms
                    ? { text: "Inbox clear", tone: "ok" }
                    : null
              }
              note="Review pending enquiries →"
              onClick={onOpenLeads}
            />
            <MetricCard
              tone="blue"
              icon={<ClipboardList size={18} />}
              label="Valid enquiries"
              value={display(counts.valid)}
              note="Forms with a name and message →"
              onClick={onOpenLeads}
            />
            <MetricCard
              tone="green"
              icon={<Briefcase size={18} />}
              label="Job applications"
              value={display(counts.applications)}
              note="Careers form submissions →"
              onClick={onOpenLeads}
            />
            <MetricCard
              tone="violet"
              icon={<FileText size={18} />}
              label="Blog articles"
              value={counts.livePosts}
              note={`${counts.draftPosts} draft · open the blog →`}
              onClick={() => onOpen("pages", "blog")}
            />
            <MetricCard
              tone="teal"
              icon={<CalendarHeart size={18} />}
              label="Events & camps"
              value={counts.liveEvents}
              note={`${counts.draftEvents} draft · manage events →`}
              onClick={() => onOpen("pages", "events")}
            />
            <MetricCard
              tone="rose"
              icon={<Stethoscope size={18} />}
              label="Services"
              value={counts.services}
              note="Care catalogue on the site →"
              onClick={() => onOpen("pages", "services")}
            />
          </div>

          <section className="master-password">
            <div className="master-card-head">
              <h3>
                <LockKeyhole size={16} aria-hidden /> Account password
              </h3>
            </div>
            <p>Change the CMS sign-in password. Use at least 6 characters. This session stays open.</p>
            <form className="admin-password-form" onSubmit={changePassword}>
              <label>
                <span>Current password</span>
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm((form) => ({ ...form, current: e.target.value }))}
                />
              </label>
              <label>
                <span>New password</span>
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={passwordForm.next}
                  onChange={(e) => setPasswordForm((form) => ({ ...form, next: e.target.value }))}
                />
              </label>
              <label>
                <span>Confirm password</span>
                <span className="admin-password-confirm">
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    minLength={6}
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm((form) => ({ ...form, confirm: e.target.value }))}
                  />
                  <button
                    type="button"
                    className="admin-reveal-btn"
                    onClick={() => setShowPassword((open) => !open)}
                    aria-label={showPassword ? "Hide passwords" : "Show passwords"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </span>
              </label>
              <button type="submit" className="admin-mini-btn admin-mini-btn-primary" disabled={savingPassword}>
                {savingPassword ? "Updating…" : "Save new password"}
              </button>
            </form>
            {passwordStatus ? <p className="admin-form-note admin-form-note--ok">{passwordStatus}</p> : null}
            {passwordError ? <p className="admin-form-note admin-form-note--error">{passwordError}</p> : null}
          </section>
        </div>

        <aside className="master-side">
          <section className="master-panel">
            <h3>Lead pipeline</h3>
            <PipelineRow label="New" value={loadingForms ? "…" : counts.leads} max={loadingForms ? 0 : pipeMax} tone="blue" />
            <PipelineRow label="Valid" value={loadingForms ? "…" : counts.valid} max={loadingForms ? 0 : pipeMax} tone="teal" />
            <PipelineRow label="Applications" value={loadingForms ? "…" : counts.applications} max={loadingForms ? 0 : pipeMax} tone="green" />
            <div className="master-split">
              <button type="button" onClick={onOpenLeads}>
                <span>General</span>
                <strong>{display(counts.general)}</strong>
              </button>
              <button type="button" onClick={onOpenLeads}>
                <span>Careers</span>
                <strong>{display(counts.applications)}</strong>
              </button>
            </div>
          </section>

          <section className="master-panel">
            <h3>Quick links</h3>
            <div className="master-links">
              {links.map((link) => (
                <button key={link.label} type="button" onClick={link.onClick}>
                  {link.label}
                  <span aria-hidden>→</span>
                </button>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
