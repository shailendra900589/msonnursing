import "./Contact.css";

export default function Contact({ contact }) {
  return (
    <section id="contact" className="contact section">
      <div className="container">
        <div className="contact-panel">
          <div className="contact-info">
            <h2 className="section-title">Get in Touch</h2>
            <p className="section-lead" style={{ marginBottom: "1.5rem" }}>
              Reach out for nursing staff, home patient care, or physiotherapy in Lucknow and
              nearby areas.
            </p>
            <ul className="contact-list">
              <li>
                <span className="contact-label">Phone</span>
                {contact.phones.map((p) => (
                  <a key={p} href={`tel:${p}`}>
                    {p}
                  </a>
                ))}
              </li>
              <li>
                <span className="contact-label">Email</span>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </li>
              <li>
                <span className="contact-label">Address</span>
                <span>{contact.address}</span>
              </li>
            </ul>
          </div>
          <form
            className="contact-form"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const name = fd.get("name");
              const message = fd.get("message");
              const subject = encodeURIComponent(`Enquiry from ${name}`);
              const body = encodeURIComponent(message);
              window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
            }}
          >
            <h3>Send a message</h3>
            <label>
              Your name
              <input name="name" type="text" required placeholder="Full name" />
            </label>
            <label>
              Phone
              <input name="phone" type="tel" placeholder="Mobile number" />
            </label>
            <label>
              Message
              <textarea
                name="message"
                rows={4}
                required
                placeholder="Tell us about your care needs..."
              />
            </label>
            <button type="submit" className="btn btn-primary">
              Email enquiry
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
