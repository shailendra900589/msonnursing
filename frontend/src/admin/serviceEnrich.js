const PROFILES = {
  "home-health": {
    keyword: "home health care Lucknow",
    staff: "A coordinator matches a nurse or trained attendant to the patient's condition.",
    includes: "help with hygiene, mobility, meals, medication reminders, and updates to the family",
    excludes: "This booking is home support. It does not replace a hospital admission or an emergency call.",
  },
  gda: {
    keyword: "GDA attendant Lucknow",
    staff: "The shift is covered by a male or female GDA attendant, as you request.",
    includes: "stay for the booked hours and help with bathing, meals, mobility, and the daily routine",
    excludes: "A GDA attendant does not give injections, start IV fluids, or perform nurse-only procedures.",
  },
  elder: {
    keyword: "elder care at home Lucknow",
    staff: "Staff are matched for an older adult, with the gender and shift length you ask for.",
    includes: "support bathing, meals, mobility, medication reminders, and companionship",
    excludes: "Elder care at home is not a diagnosis or a hospital bed. A sudden fall, chest pain, or confusion needs urgent medical care.",
  },
  nurse: {
    keyword: "registered nurse at home Lucknow",
    staff: "A nurse is assigned for the shift or visit, and the coordinator states the qualification before duty starts.",
    includes: "monitor the patient, give medication reminders, and carry out clinical tasks that match the nurse's training and the doctor's instructions",
    excludes: "The fee does not include a doctor consultation or medicines unless the rate note says so.",
  },
  injection: {
    keyword: "injection at home Lucknow",
    staff: "A trained nurse gives the injection. This is a nurse visit, not a doctor consultation.",
    includes: "give the prescribed injection, including TT when that is the booking, and tell the family what to watch afterwards",
    excludes: "The nurse does not choose the medicine. A prescription or written instruction is required. Syringes and vials are extra unless agreed on the call.",
  },
  iv: {
    keyword: "IV drip at home Lucknow",
    staff: "A nurse sets up the line. Fluids or IV medicine are given only as a doctor directed.",
    includes: "insert or check a cannula and start the prescribed drip",
    excludes: "IV fluids, cannulas, and medicines are extra unless the rate note includes them. Severe dehydration, chest pain, or collapse needs emergency care.",
  },
  wound: {
    keyword: "wound dressing at home Lucknow",
    staff: "A nurse does the dressing at home.",
    includes: "clean and dress the wound you booked and say if it needs a doctor to review it",
    excludes: "Dressing packs are extra unless stated. A wound that is spreading, deeply open, or bleeding heavily needs a hospital.",
  },
  catheter: {
    keyword: "catheter care at home Lucknow",
    staff: "A nurse handles the catheter care that was booked, including a Foley change when that is the service.",
    includes: "insert, change, or care for a urinary catheter and explain bag care to the family",
    excludes: "Catheter kits are extra unless stated. No urine output, fever, or severe pain needs urgent medical care.",
  },
  baby: {
    keyword: "baby care at home Lucknow",
    staff: "An ayah or baby-care attendant follows the routine the family and the clinician have set.",
    includes: "help with feeding support, hygiene, and the newborn or infant routine",
    excludes: "This is not neonatal intensive care. A baby who is struggling to breathe or feed needs a hospital.",
  },
  physio: {
    keyword: "physiotherapy at home Lucknow",
    staff: "A physiotherapy visit is arranged at home for the problem you describe.",
    includes: "guide mobility, stiffness, or recovery exercises that a clinician has advised",
    excludes: "A home session does not replace an orthopaedic or neurological review after a new injury.",
  },
  caretaker: {
    keyword: "patient care taker Lucknow",
    staff: "A care taker stays with the patient for the hours you book.",
    includes: "help with daily living, hygiene, meals, and keeping the family informed",
    excludes: "A care taker does not replace a nurse for injections, IV fluids, or wound procedures.",
  },
  attendant: {
    keyword: "nursing attendant Lucknow",
    staff: "An attendant is assigned, including a female attendant when that is requested.",
    includes: "help with personal care, mobility, and the household routine around the patient",
    excludes: "Attendant duty is not a clinical procedure and does not include medicines unless a nurse is booked separately.",
  },
  hospital: {
    keyword: "hospital nursing staff Lucknow",
    staff: "Nursing staff can be placed for hospital, clinic, or private-duty hours.",
    includes: "cover the agreed shift under the facility's or family's instructions",
    excludes: "The hospital or clinic remains responsible for its medical orders. Confirm the shift length when you book.",
  },
  recovery: {
    keyword: "post surgery care at home Lucknow",
    staff: "Staff support the patient after discharge, following the surgeon's written instructions.",
    includes: "help with positioning, hygiene, medication reminders, and the wound plan the hospital gave you",
    excludes: "Home support does not replace the surgeon's follow-up. Fever, sudden bleeding, or severe pain needs urgent care.",
  },
  respiratory: {
    keyword: "oxygen support at home Lucknow",
    staff: "Staff help the family use oxygen equipment a doctor has already prescribed.",
    includes: "explain safe use of the equipment already in the home and stay for the booked support",
    excludes: "This page does not sell oxygen concentrators. Sudden breathlessness needs emergency medical services.",
  },
  "home-nursing": {
    keyword: "home nursing Lucknow",
    staff: "The coordinator matches a nurse or attendant to the request.",
    includes: "provide the home support described when you call",
    excludes: "Medicines and consumables are extra unless stated. Emergencies need the ambulance service.",
  },
};

const ANGLES = {
  "home-health-care-service": "It is an ongoing home-health plan for a patient who needs regular support in the house.",
  "gda-male-and-female-12-hours": "It is a 12-hour GDA shift, with male or female staff.",
  "elderly-care-service": "It is daily support for an older person at home, usually on a 12-hour GDA shift.",
  "registered-nurses-12-hours": "It is a 12-hour shift with male or female nursing staff, not a short procedure visit.",
  "medical-care-nurse": "It is a nurse visit for clinical care that a family cannot safely do alone.",
  "elder-care-nurse": "It is nurse-level support for an older adult, above a basic attendant shift.",
  "hospital-nursing-services": "It places nursing staff inside a hospital, clinic, or private-duty setting in Lucknow.",
  "nursing-care-taker": "It is a care taker for a person who is ill, recovering, or needs someone present.",
  "skilled-nursing": "It is skilled nursing for tasks that need a nurse rather than an attendant.",
  "post-surgical-care-at-home": "It supports a patient at home after an operation, using the discharge instructions.",
  "wound-care": "It is nurse-led wound care at home when a dressing needs to be done properly.",
  "trained-nursing-staff-per-visit": "It is a per-visit nurse call. Dressing items are not included in the visit fee.",
  "elder-care-at-home": "It keeps an older adult supported at home on a 12-hour GDA shift.",
  "injection-iv-catheter-tt-at-home": "It covers a booked nurse procedure at home: injection, IV, catheter care, or TT.",
  "o2-concentrator-support": "It is help using oxygen equipment that is already prescribed. The concentrator itself is not sold here.",
  "home-patient-care": "It is general patient care at home for someone who needs a person present through the day.",
  "care-taker-service-at-home": "It sends a care taker to the house for the hours the family needs.",
  "female-nursing-attendant": "It is an attendant booking when the family wants female staff.",
  "best-gda-staff": "It is a 12-hour shift with screened male or female GDA staff.",
  "old-age-care-taker-service": "It is a trained GDA care taker for an older adult.",
  "home-injection-services": "It sends a nurse to give a prescribed injection at home.",
  "injection-nurse-at-home": "A nurse comes to the house to give the injection written on the prescription.",
  "doctor-injection-at-home": "The injection must be one a doctor has prescribed. The person who visits is a trained nurse, not a consulting doctor.",
  "nursing-injection-services": "It is a nursing visit whose purpose is the prescribed injection.",
  "wound-dressing-at-home": "A nurse changes the wound dressing at the patient's home.",
  "home-bandage-services": "A nurse applies or changes a bandage or dressing at home.",
  "post-surgery-dressing-care": "It is a dressing visit after surgery, following the hospital's wound instructions.",
  "nursing-dressing-care": "A nurse does the dressing and checks whether the family should go back to a doctor.",
  "iv-cannula-insertion-at-home": "A nurse inserts an IV cannula at home so prescribed fluids or medicine can run.",
  "iv-line-at-home": "A nurse sets up or checks an IV line at home.",
  "home-nursing-iv-setup": "It is the nursing setup for an IV at home, before or during a prescribed drip.",
  "nursing-cannulation-services": "A nurse performs cannulation at home for a prescribed IV.",
  "urinary-catheter-care-at-home": "A nurse provides urinary catheter care at home, including bag care guidance.",
  "catheter-insertion-at-home": "A nurse inserts a urinary catheter at home when that procedure has been requested.",
  "foley-s-catheter-change-service": "A nurse changes a Foley's catheter at home.",
  "nursing-catheter-support": "It is nursing support for a patient who already has, or needs, a catheter.",
  "home-nurse-for-injection": "It books a home nurse whose task is the prescribed injection.",
  "on-call-tt-injection-at-home": "It is an on-call nurse visit for a tetanus toxoid injection, done with hygienic technique.",
  "iv-fluids-at-home": "IV fluids are started at home only in the way the doctor directed.",
  "iv-drip-services-at-home": "A nurse runs an IV drip at home for a patient who already has medical advice for it.",
  "nursing-iv-therapy": "IV medicine or fluids are given only against a prescription.",
  "saline-drip-at-home": "A saline drip is given only on prescription, including cases such as dehydration, weakness, or fever support that a doctor has already directed.",
  "ayas-for-baby-elder-care": "An ayah can be booked for a baby, an older person, or both, depending on the home.",
  "baby-care": "It is baby care at home for feeding support, hygiene, and the infant routine.",
  "physiotherapy-at-home": "Physiotherapy is done at home for mobility, stiffness, or recovery exercises.",
};

function clip(text, max) {
  const value = String(text || "").replace(/\s+/g, " ").trim();
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trim()}…`;
}

function profileFor(category) {
  return PROFILES[category] || PROFILES["home-nursing"];
}

function feeSentence(service, phone, city) {
  if (!service.price) {
    return `No fixed fee is printed for this service. Call ${phone} for a quote based on timing and the address in ${city}.`;
  }
  const note = service.priceNote ? ` Rate note: ${service.priceNote}.` : "";
  return `The published fee is ${service.price}.${note} Medicines and consumables are extra unless that note includes them.`;
}

export function enrichService(service, ctx = {}) {
  const siteName = ctx.siteName || "Mson Nursing Services";
  const city = ctx.city || "Lucknow";
  const region = ctx.region || "Uttar Pradesh";
  const country = ctx.country || "IN";
  const phone = ctx.phone || "9807925369";
  const title = service.title || "Nursing service";
  const category = service.category || "home-nursing";
  const profile = profileFor(category);
  const angle = ANGLES[service.id] || `${title} is arranged by the ${siteName} desk in ${city}.`;
  const fee = feeSentence(service, phone, city);

  const paragraphs = [
    `${title} is offered by ${siteName} in ${city}, ${region}. ${angle} ${profile.staff}`,
    `During ${title}, staff ${profile.includes}. ${fee}`,
    `${profile.excludes} Call emergency medical services for chest pain, trouble breathing, heavy bleeding, a seizure, or collapse.`,
    `To book, call ${phone} or send the enquiry form. Share the patient's age, the locality in ${city}, whether you need male or female staff, and the time. The office is in Ashok Vihar, Sector 8, Indira Nagar, Lucknow 226016. The coordinator names the assigned person and repeats what the fee covers before care starts.`,
  ];
  const longContent = paragraphs.join("\n\n");
  const short = clip(`${angle} ${service.price ? `Fee ${service.price}.` : "Call for a quote."} ${city}.`, 170);

  const careSteps = [
    {
      title: "Tell us the need",
      text: `Call ${phone} or use the form. Name ${title}, the patient's condition, the address in ${city}, and the time.`,
    },
    {
      title: "We confirm staff and fee",
      text: `${profile.staff} You hear the fee, and what is extra, before anyone is sent.`,
    },
    {
      title: "Care happens as booked",
      text: `Staff ${profile.includes}. If the situation looks urgent, they will tell the family to seek emergency care.`,
    },
  ];

  const idealFor = [
    `Homes in ${city} that need ${title.toLowerCase()}`,
    service.price ? `Families who want the published fee of ${service.price} explained before booking` : `Families who want a quote before ${title.toLowerCase()} starts`,
    "People who can share a prescription or care plan when the task is clinical",
  ];

  const faq = [
    {
      q: `What happens during ${title} in ${city}?`,
      a: `${angle} Staff ${profile.includes}.`,
    },
    {
      q: `What is the fee for ${title}?`,
      a: fee,
    },
    {
      q: `When is ${title} not enough?`,
      a: `${profile.excludes} For an emergency, contact emergency medical services first.`,
    },
  ];

  const keywords = [
    `${title} Lucknow`,
    `${title} in Lucknow`,
    profile.keyword,
    `${profile.keyword.split(" ").slice(0, 3).join(" ")} at home`,
    "Mson Nursing Services",
    city,
  ].join(", ");

  const feeBit = service.price ? ` Fee ${service.price}.` : "";
  const withAngle = `${title} in ${city}. ${angle}${feeBit} Call ${phone}.`;
  const withoutAngle = `${title} in ${city}.${feeBit} Call ${phone} to book.`;
  const seoDescription = withAngle.length <= 160 ? withAngle : withoutAngle;

  const pageTitle = `${title} in ${city} | ${siteName}`;
  const seoTitle = pageTitle.length <= 68 ? pageTitle : `${title} | ${siteName}`;

  const seo = {
    title: seoTitle,
    description: seoDescription,
    keywords,
    tags: [category, city, region, profile.keyword].join(", "),
    geoCity: city,
    geoRegion: region,
    geoCountry: country,
    ogTitle: `${title} — ${siteName}`,
    ogDescription: clip(short, 200),
    canonicalPath: `/services/${service.id}`,
    sitemapPriority: "0.85",
    aeoSummary: clip(`${siteName} provides ${title} in ${city}. ${fee} Call ${phone}.`, 200),
  };

  const eeat = {
    expertise: `${siteName} arranges ${title} in ${city}. ${profile.staff}`,
    experience: `The agency has taken home-care bookings in ${city} since 2020. Each ${title} booking is confirmed on the phone before staff leave for the address.`,
    authoritativeness: `The office is at Ashok Vihar, Sector 8, Indira Nagar, Lucknow 226016. Families can confirm a booking on ${phone} or 8894654090.`,
    trust: "Staff are screened before duty. The coordinator states the fee and what is not included before care starts. Clinical tasks follow a prescription or the family's written instructions.",
    author: `${siteName}, Lucknow`,
    credentials: `Home nursing agency in Lucknow, established 2020. Ask the coordinator whether this booking is a GDA attendant, a nurse, or a physiotherapy visit.`,
    medicalDisclaimer: `${profile.excludes} This page is service information from ${siteName}, not a personal medical diagnosis.`,
  };

  const features = [
    profile.staff.replace(/\.$/, ""),
    service.price ? `Published fee ${service.price}` : "Fee quoted before anyone is sent",
    "Male or female staff when you ask, subject to availability",
    category === "injection" || category === "iv" || category === "wound" || category === "catheter"
      ? "Prescription or written instructions required"
      : "Daily routine agreed with the family before the shift",
  ];

  return {
    ...service,
    shortDescription: short,
    description: paragraphs[0],
    longContent,
    idealFor,
    careSteps,
    features,
    faq,
    eeat,
    seo: {
      ...(service.seo || {}),
      ...seo,
      ogImage: service.seo?.ogImage || service.image || "",
      ogImageAlt: service.seo?.ogImageAlt || service.imageAlt || title,
    },
  };
}

export function enrichAllServices(content) {
  const ctx = {
    siteName: content.site?.name,
    city: content.site?.location?.split(",")[0]?.trim() || "Lucknow",
    region: "Uttar Pradesh",
    phone: content.contact?.phones?.[0],
    address: content.contact?.address,
  };
  const services = (content.services || []).map((s, i) =>
    enrichService({ ...s, sortOrder: s.sortOrder ?? i + 1 }, ctx)
  );
  return { ...content, services: normalizeServiceOrder(services) };
}

export function normalizeServiceOrder(services) {
  const sorted = [...services].sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
  return sorted.map((s, i) => ({ ...s, sortOrder: i + 1 }));
}

export function moveService(services, index, direction) {
  const list = normalizeServiceOrder(services);
  const target = direction === "up" ? index - 1 : index + 1;
  if (target < 0 || target >= list.length) return list;
  [list[index], list[target]] = [list[target], list[index]];
  return normalizeServiceOrder(list);
}

export function insertServiceAt(services, atIndex, factory) {
  const list = normalizeServiceOrder(services);
  const item = factory(list.length + 1);
  list.splice(atIndex, 0, item);
  return normalizeServiceOrder(list);
}
