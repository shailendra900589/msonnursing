import { Link, useOutletContext, useParams } from "react-router-dom";
import { Briefcase, MapPin } from "lucide-react";
import Seo from "../components/Seo.jsx";
import PageHeader from "../components/PageHeader.jsx";
import ContactEnquiryForm from "../components/ContactEnquiryForm.jsx";
import Btn from "../components/ui/Btn.jsx";
import { employmentLabel, salaryUnitLabel } from "../utils/jobPosting.js";
import "./JobsPage.css";

function salaryText(job) {
  const min = Number(job.salaryMin);
  const max = Number(job.salaryMax);
  if (!(min > 0) && !(max > 0)) return "";
  const unit = salaryUnitLabel(job.salaryUnit).toLowerCase();
  if (min > 0 && max > 0 && min !== max) return `₹${min.toLocaleString("en-IN")} – ₹${max.toLocaleString("en-IN")} ${unit}`;
  return `₹${(min > 0 ? min : max).toLocaleString("en-IN")} ${unit}`;
}

export default function JobDetailPage() {
  const { id } = useParams();
  const { content } = useOutletContext();
  const job = (content.jobs || []).find((item) => item.id === id);
  const labels = content.labels || {};
  const page = content.pages?.jobs || {};

  if (!job || job.published === false) {
    return (
      <div className="container section center">
        <Seo
          noindex
          title="Job not found | Mson Nursing Services"
          description="This job is not available. See open nursing and caregiver roles in Lucknow."
        />
        <h1>Job not found</h1>
        <Btn to="/jobs">Back to careers</Btn>
      </div>
    );
  }

  const place =
    job.workplace === "TELECOMMUTE"
      ? "Remote"
      : [job.streetAddress, job.addressLocality, job.addressRegion, job.postalCode].filter(Boolean).join(", ");
  const paragraphs = String(job.description || "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <>
      <Seo pageKey={`job-${job.id}`} job={job} />
      <PageHeader
        title={job.title}
        subtitle={job.summary || employmentLabel(job.employmentType)}
        breadcrumbs={[
          { label: labels.homeBreadcrumb || "Home", to: "/" },
          { label: page.title || "Careers", to: "/jobs" },
          { label: job.title, to: null },
        ]}
      />
      <section className="section">
        <div className="container job-detail">
          <article className="job-detail-copy">
            <p className="job-card-meta">
              <Briefcase size={16} aria-hidden /> {employmentLabel(job.employmentType)}
              {job.datePosted ? ` · Posted ${job.datePosted}` : ""}
              {job.validThrough ? ` · Apply until ${job.validThrough}` : ""}
            </p>
            <p className="job-card-meta">
              <MapPin size={16} aria-hidden /> {place || "Lucknow"}
              {salaryText(job) ? ` · ${salaryText(job)}` : ""}
            </p>
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <Link to="/jobs">All open roles</Link>
          </article>
          <ContactEnquiryForm
            contact={content.contact}
            form={{
              ...(content.forms?.contact || {}),
              formTitle: `Apply for ${job.title}`,
              messageLabel: "Cover note",
              messagePlaceholder: "Tell us about your experience and when you can start.",
              submitLabel: "Submit application",
            }}
            labels={labels}
            sourcePath={`/jobs/${job.id}`}
            sourcePage="Job application"
            jobId={job.id}
            jobTitle={job.title}
          />
        </div>
      </section>
    </>
  );
}
