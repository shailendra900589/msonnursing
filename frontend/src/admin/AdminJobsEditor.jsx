import { Briefcase, Trash2 } from "lucide-react";
import { newJob } from "./contentHelpers.js";
import { EMPLOYMENT_TYPES, SALARY_UNITS } from "../utils/jobPosting.js";

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export default function AdminJobsEditor({ data, update }) {
  const jobs = data.jobs || [];

  const addJob = () => {
    const next = structuredClone(data);
    if (!Array.isArray(next.jobs)) next.jobs = [];
    next.jobs.unshift(newJob());
    update(null, null, next);
  };

  const removeJob = (index) => {
    const next = structuredClone(data);
    next.jobs.splice(index, 1);
    update(null, null, next);
  };

  return (
    <div className="admin-stack admin-stack-tight">
      <section className="admin-card">
        <div className="admin-card-head">
          <h2>
            <Briefcase size={18} aria-hidden /> Job posts
          </h2>
          <button type="button" className="admin-mini-btn admin-mini-btn-primary" onClick={addJob}>
            Add job
          </button>
        </div>
        <p className="admin-form-note admin-form-note--lead">
          Published jobs appear on the Careers page. Each job page includes Google JobPosting data and a sitemap link, so Google for Jobs can list it after the live site is crawled. Click Publish to save.
        </p>
      </section>

      {jobs.map((job, index) => (
        <section key={`${job.id}-${index}`} className="admin-card">
          <div className="admin-card-head">
            <h2>{job.title || "Untitled job"}</h2>
            <button type="button" className="admin-mini-btn" onClick={() => removeJob(index)}>
              <Trash2 size={14} aria-hidden /> Remove
            </button>
          </div>
          <div className="admin-grid admin-grid-dense">
            <label className="admin-field">
              <span>Job title</span>
              <input value={job.title || ""} onChange={(e) => update(`jobs.${index}.title`, e.target.value)} />
            </label>
            <label className="admin-field">
              <span>URL id</span>
              <input
                value={job.id || ""}
                onChange={(e) => update(`jobs.${index}.id`, slugify(e.target.value) || e.target.value)}
              />
            </label>
            <label className="admin-field">
              <span>Status</span>
              <select
                value={job.published === false ? "false" : "true"}
                onChange={(e) => update(`jobs.${index}.published`, e.target.value === "true")}
              >
                <option value="true">Published</option>
                <option value="false">Draft</option>
              </select>
            </label>
            <label className="admin-field">
              <span>Employment type</span>
              <select value={job.employmentType || "FULL_TIME"} onChange={(e) => update(`jobs.${index}.employmentType`, e.target.value)}>
                {EMPLOYMENT_TYPES.map(([id, label]) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="admin-field">
              <span>Workplace</span>
              <select value={job.workplace || "ONSITE"} onChange={(e) => update(`jobs.${index}.workplace`, e.target.value)}>
                <option value="ONSITE">On-site</option>
                <option value="TELECOMMUTE">Remote</option>
              </select>
            </label>
            <label className="admin-field">
              <span>Date posted</span>
              <input type="date" value={job.datePosted || ""} onChange={(e) => update(`jobs.${index}.datePosted`, e.target.value)} />
            </label>
            <label className="admin-field">
              <span>Apply until</span>
              <input type="date" value={job.validThrough || ""} onChange={(e) => update(`jobs.${index}.validThrough`, e.target.value)} />
            </label>
            <label className="admin-field">
              <span>Salary min (INR)</span>
              <input value={job.salaryMin || ""} onChange={(e) => update(`jobs.${index}.salaryMin`, e.target.value)} />
            </label>
            <label className="admin-field">
              <span>Salary max (INR)</span>
              <input value={job.salaryMax || ""} onChange={(e) => update(`jobs.${index}.salaryMax`, e.target.value)} />
            </label>
            <label className="admin-field">
              <span>Salary period</span>
              <select value={job.salaryUnit || "MONTH"} onChange={(e) => update(`jobs.${index}.salaryUnit`, e.target.value)}>
                {SALARY_UNITS.map(([id, label]) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="admin-field">
              <span>City</span>
              <input value={job.addressLocality || ""} onChange={(e) => update(`jobs.${index}.addressLocality`, e.target.value)} />
            </label>
            <label className="admin-field">
              <span>State</span>
              <input value={job.addressRegion || ""} onChange={(e) => update(`jobs.${index}.addressRegion`, e.target.value)} />
            </label>
            <label className="admin-field">
              <span>Postal code</span>
              <input value={job.postalCode || ""} onChange={(e) => update(`jobs.${index}.postalCode`, e.target.value)} />
            </label>
            <label className="admin-field admin-field-span-2">
              <span>Street address</span>
              <input value={job.streetAddress || ""} onChange={(e) => update(`jobs.${index}.streetAddress`, e.target.value)} />
            </label>
            <label className="admin-field admin-field-span-2">
              <span>Short summary</span>
              <input value={job.summary || ""} onChange={(e) => update(`jobs.${index}.summary`, e.target.value)} />
            </label>
            <label className="admin-field admin-field-span-2">
              <span>Full description</span>
              <textarea rows={6} value={job.description || ""} onChange={(e) => update(`jobs.${index}.description`, e.target.value)} />
            </label>
          </div>
        </section>
      ))}

      {!jobs.length ? <p className="admin-form-note">No jobs yet. Add one, fill the details, then publish.</p> : null}
    </div>
  );
}
