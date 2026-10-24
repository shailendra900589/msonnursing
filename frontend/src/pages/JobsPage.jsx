import { Link, useOutletContext } from "react-router-dom";
import { Briefcase, MapPin } from "lucide-react";
import Seo from "../components/Seo.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Reveal from "../components/Reveal.jsx";
import { employmentLabel, salaryUnitLabel } from "../utils/jobPosting.js";
import "./JobsPage.css";

function salaryText(job) {
  const min = Number(job.salaryMin);
  const max = Number(job.salaryMax);
  if (!(min > 0) && !(max > 0)) return "";
  const unit = salaryUnitLabel(job.salaryUnit).toLowerCase();
  if (min > 0 && max > 0 && min !== max) return `₹${min.toLocaleString("en-IN")} – ₹${max.toLocaleString("en-IN")} ${unit}`;
  const amount = (min > 0 ? min : max).toLocaleString("en-IN");
  return `₹${amount} ${unit}`;
}

export default function JobsPage() {
  const { content } = useOutletContext();
  const page = content.pages?.jobs || {};
  const labels = content.labels || {};
  const jobs = (content.jobs || []).filter((job) => job.published !== false);

  return (
    <>
      <Seo pageKey="jobs" />
      <PageHeader
        title={page.title || "Careers"}
        subtitle={page.subtitle || "Open nursing and caregiver roles with Mson Nursing Services."}
        breadcrumbs={[
          { label: labels.homeBreadcrumb || "Home", to: "/" },
          { label: page.title || "Careers", to: null },
        ]}
      />
      <section className="section">
        <div className="container jobs-list">
          {jobs.map((job, index) => {
            const place = job.workplace === "TELECOMMUTE" ? "Remote" : [job.addressLocality, job.addressRegion].filter(Boolean).join(", ");
            return (
              <Reveal key={job.id} variant="up" delay={index * 60}>
                <Link className="job-card" to={`/jobs/${job.id}`}>
                  <div>
                    <p className="job-card-kicker">{employmentLabel(job.employmentType)}</p>
                    <h2>{job.title}</h2>
                    {job.summary ? <p>{job.summary}</p> : null}
                    <p className="job-card-meta">
                      <MapPin size={15} aria-hidden /> {place || "Lucknow"}
                      {salaryText(job) ? ` · ${salaryText(job)}` : ""}
                    </p>
                  </div>
                  <span className="job-card-link">View role</span>
                </Link>
              </Reveal>
            );
          })}
          {!jobs.length ? (
            <div className="job-empty">
              <Briefcase size={22} aria-hidden />
              <p>No open roles right now. Please check back soon, or send a general enquiry from the contact page.</p>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
