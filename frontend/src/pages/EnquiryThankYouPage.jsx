import { Link, useLocation, useOutletContext } from "react-router-dom";
import { CheckCircle2, MessageCircle, Phone, ArrowLeft } from "lucide-react";
import Seo from "../components/Seo.jsx";
import Btn from "../components/ui/Btn.jsx";
import { whatsappUrl } from "../utils/whatsapp.js";

export default function EnquiryThankYouPage() {
  const { state } = useLocation();
  const { content } = useOutletContext();
  const { contact, labels } = content;
  const enquiry = state?.enquiry;
  const phone = contact.phones?.[0];
  const waLink = whatsappUrl(
    contact.whatsapp || phone,
    enquiry?.whatsappMessage ||
      `Hello ${content.site.name}, my enquiry ref ${enquiry?.id || ""}. ${enquiry?.message || ""}`
  );

  return (
    <>
      <Seo
        noindex
        pageKey="thanks"
        title="Enquiry received | Mson Nursing Services"
        description="Your care enquiry was received. A coordinator from Mson Nursing Services will call you."
      />
      <section className="section enquiry-thanks">
        <div className="container enquiry-thanks-card hover-lift">
          <CheckCircle2 size={48} className="enquiry-thanks-icon" aria-hidden />
          <h1>{labels?.enquiryThanksTitle || "Thank you — enquiry received"}</h1>
          <p className="prose">{labels?.enquiryThanksLead || "Our care coordinator will call you shortly. You can also reach us instantly below."}</p>

          {enquiry ? (
            <dl className="enquiry-thanks-details">
              <div>
                <dt>Reference</dt>
                <dd>{enquiry.id}</dd>
              </div>
              <div>
                <dt>Your name</dt>
                <dd>{enquiry.name}</dd>
              </div>
              {enquiry.phone ? (
                <div>
                  <dt>Phone</dt>
                  <dd>{enquiry.phone}</dd>
                </div>
              ) : null}
              <div>
                <dt>Requirement</dt>
                <dd>{enquiry.message}</dd>
              </div>
              <div>
                <dt>Submitted from</dt>
                <dd>
                  {enquiry.sourcePage || "Website"}
                  {enquiry.sourcePath ? (
                    <>
                      {" "}
                      (<Link to={enquiry.sourcePath}>{enquiry.sourcePath}</Link>)
                    </>
                  ) : null}
                </dd>
              </div>
              {enquiry.serviceTitle ? (
                <div>
                  <dt>Service</dt>
                  <dd>
                    {enquiry.serviceId ? (
                      <Link to={`/services/${enquiry.serviceId}`}>{enquiry.serviceTitle}</Link>
                    ) : (
                      enquiry.serviceTitle
                    )}
                  </dd>
                </div>
              ) : null}
              {enquiry.eventTitle ? (
                <div>
                  <dt>Event</dt>
                  <dd>
                    {enquiry.eventId ? (
                      <Link to={`/events/${enquiry.eventId}`}>{enquiry.eventTitle}</Link>
                    ) : (
                      enquiry.eventTitle
                    )}
                  </dd>
                </div>
              ) : null}
            </dl>
          ) : (
            <p className="admin-hint">{labels?.enquiryThanksNoState || "If you closed this tab, call us directly — we are here to help."}</p>
          )}

          <div className="enquiry-thanks-actions">
            {waLink ? (
              <Btn href={waLink} icon={MessageCircle} target="_blank" rel="noopener noreferrer" pulse>
                {labels?.enquiryWhatsApp || "Continue on WhatsApp"}
              </Btn>
            ) : null}
            {phone ? (
              <Btn href={`tel:${phone.replace(/\s/g, "")}`} variant="outline" icon={Phone}>
                {labels?.enquiryCall || `Call ${phone}`}
              </Btn>
            ) : null}
            <Btn to={enquiry?.sourcePath || "/"} variant="ghost" icon={ArrowLeft}>
              {labels?.enquiryBack || "Back to page"}
            </Btn>
          </div>
        </div>
      </section>
    </>
  );
}
