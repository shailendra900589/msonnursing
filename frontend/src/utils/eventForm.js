/** Resolve which registration UI to show for an event. */
export function getEventRegistrationConfig(event, content) {
  const defaults = content?.forms?.eventRegistration || content?.forms?.contact || {};
  const rf = event?.registrationForm || {};
  const useCustom =
    rf.useCustomFields === true && Array.isArray(rf.fields) && rf.fields.filter((f) => f?.id && f?.label).length > 0;

  return {
    useCustom,
    formTitle: rf.formTitle?.trim() || defaults.formTitle || "Register interest",
    submitLabel: rf.submitLabel?.trim() || defaults.submitLabel || "Register",
    whatsappLabel: rf.whatsappLabel?.trim() || defaults.whatsappLabel || "WhatsApp instead",
    nameLabel: defaults.nameLabel || "Full name",
    phoneLabel: defaults.phoneLabel || "Phone",
    messageLabel: defaults.messageLabel || "Message",
    namePlaceholder: defaults.namePlaceholder || "Your name",
    phonePlaceholder: defaults.phonePlaceholder || "Mobile number",
    messagePlaceholder: defaults.messagePlaceholder || "Tell us about your requirement…",
    fields: useCustom ? rf.fields.filter((f) => f?.id && f?.label) : [],
  };
}

export function buildCustomFormMessage(eventTitle, fields, values) {
  const lines = [`Event registration: ${eventTitle}`];
  for (const field of fields) {
    const v = values[field.id];
    if (v !== undefined && v !== null && String(v).trim() !== "") {
      lines.push(`${field.label}: ${String(v).trim()}`);
    }
  }
  return lines.join("\n");
}

export function pickNamePhoneFromCustom(fields, values) {
  let name = "";
  let phone = "";
  for (const field of fields) {
    const v = String(values[field.id] || "").trim();
    if (!v) continue;
    const id = field.id.toLowerCase();
    const label = field.label.toLowerCase();
    if (!name && (field.type === "text" || field.type === "email") && (id.includes("name") || label.includes("name"))) {
      name = v;
    }
    if (!phone && (field.type === "tel" || id.includes("phone") || label.includes("phone") || label.includes("mobile"))) {
      phone = v;
    }
  }
  if (!name) {
    const firstText = fields.find((f) => ["text", "email"].includes(f.type) && values[f.id]);
    if (firstText) name = String(values[firstText.id]).trim();
  }
  if (!phone) {
    const tel = fields.find((f) => f.type === "tel" && values[f.id]);
    if (tel) phone = String(values[tel.id]).trim();
  }
  return { name, phone };
}
