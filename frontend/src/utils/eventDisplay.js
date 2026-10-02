const FALLBACK_EVENT_IMAGE =
  "https://images.pexels.com/photos/27298085/pexels-photo-27298085.jpeg?auto=compress&cs=tinysrgb&w=1400";

export function eventFallbackImage() {
  return FALLBACK_EVENT_IMAGE;
}

export function enrichEventForDisplay(event, ctx = {}) {
  const siteName = ctx.siteName || "Mson Nursing Services";
  const city = ctx.city || "Lucknow";
  const phone = ctx.phone || "";
  const title = event.title || "Event";

  const longContent =
    event.longContent ||
    [
      `${title} by ${siteName} connects families in ${city} with practical nursing and home-care guidance.`,
      event.description,
      `Our coordinators explain how to plan safe care at home — staffing options, visit schedules, and what to expect before you book.`,
      `Whether you need a one-day camp visit or ongoing campaign support through the month, we respond with clear next steps and verified staff matching.`,
    ]
      .filter(Boolean)
      .join("\n\n");

  const defaultAgenda = [
    { title: "Meet our care team", text: `Discuss your family's needs with ${siteName} coordinators in ${city}.` },
    { title: "Understand care options", text: "Learn about nurses, GDA attendants, elder care, and visit-based clinical support." },
    { title: "Plan next steps", text: phone ? `Call ${phone} or register interest — we confirm timing and staff availability.` : "Register interest — we confirm timing and staff availability." },
    {
      title: "Ongoing coordinator support",
      text: `${siteName} stays available for schedule changes, staff replacements, and family feedback after care starts.`,
    },
  ];

  let agenda = event.agenda?.length ? [...event.agenda] : defaultAgenda;
  if (agenda.length > 0 && agenda.length < 4) {
    agenda = [
      ...agenda,
      {
        title: "Ongoing coordinator support",
        text: `${siteName} stays available for schedule changes, staff replacements, and family feedback after care starts.`,
      },
    ].slice(0, 4);
  }

  const whoFor = event.whoFor?.length
    ? event.whoFor
    : [
        `Families in ${city} caring for elders or post-hospital patients`,
        "Anyone exploring professional home nursing for the first time",
        "Clinics and societies hosting community health awareness",
      ];

  const defaultFaq = [
    {
      q: `How do I register for ${title}?`,
      a: `Contact ${siteName} via phone or the enquiry form. Share patient age, location in ${city}, and preferred dates.`,
    },
    {
      q: "Is there a fee to attend?",
      a: "Community camps and awareness sessions are free. Home care placements are quoted separately with transparent coordination.",
    },
    {
      q: "Can I get home nursing after the event?",
      a: `Yes. Coordinators explain staffing options in ${city} and help you book nurses or attendants for ongoing home care.`,
    },
    {
      q: "How are caregivers verified?",
      a: `${siteName} coordinates identity checks, experience review, and orientation on safety and patient dignity before placement.`,
    },
  ];

  const faq = event.faq?.length ? event.faq.slice(0, 4) : defaultFaq;

  return {
    ...event,
    longContent,
    agenda,
    whoFor,
    faq,
    highlights: event.highlights?.length ? event.highlights : ["Professional nursing guidance", "Home care planning support"],
  };
}
