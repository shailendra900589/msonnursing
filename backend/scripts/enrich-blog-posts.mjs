import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const file = join(dirname(fileURLToPath(import.meta.url)), "../src/data/content.json");
const content = JSON.parse(readFileSync(file, "utf-8"));

const enrich = {
  "home-nursing-guide-lucknow": {
    body: `Home nursing services in Lucknow help families manage elder care, injections, IV drips, wound dressing, and long-term patient support without long hospital stays. Whether you need a few hours of supervision or 24-hour duty, the right plan starts with understanding who does what at home.

General Duty Assistants (GDA) support daily living — hygiene, feeding, mobility, and companionship — under family or nurse guidance. Registered nurses handle clinical tasks such as medication administration, vitals, wound care, and post-surgery monitoring. Visit-based nurses are ideal for injections, IV fluids, catheter care, and dressing changes on a scheduled basis.

Before you book, list the patient's diagnosis, mobility level, expected duration of care, and whether you need male or female staff. Confirm timing (12-hour day/night, live-in, or single visit) and your locality in Lucknow so coordinators can match staff without delays.

Mson Nursing Services screens caregivers, explains fees upfront, and stays available if you need replacement staff or schedule changes. Families across Indira Nagar, Gomti Nagar, and Ashok Vihar use us for transparent coordination rather than informal referrals.

When comparing agencies, ask about verification, handover process, emergency escalation, and what is included in visit fees versus consumables. A written care plan — even a simple WhatsApp summary — reduces confusion for elders and post-surgery patients alike.

Ready to start? Call our coordinator with patient age, address, and preferred start date. We will suggest GDA, nurse, or visit-based options that fit your budget and medical needs.`,
    faq: [
      {
        q: "What is the difference between GDA staff and a registered nurse at home?",
        a: "GDA attendants support daily living and monitoring under guidance. Registered nurses perform clinical nursing tasks prescribed by your doctor. Mson Nursing Services helps you choose the right mix.",
      },
      {
        q: "Can I hire male or female staff for home nursing in Lucknow?",
        a: "Yes. Tell us your preference when enquiring. We match verified male or female GDA staff and nurses based on availability and your location.",
      },
      {
        q: "How quickly can home nursing start in Lucknow?",
        a: "Many enquiries receive same-day coordination for visits or duty. Long-term placements depend on shift type — share your timeline when you call.",
      },
    ],
    relatedServiceIds: ["home-health-care-service", "gda-male-and-female-12-hours", "registered-nurses-12-hours"],
  },
  "elder-care-at-home-tips": {
    body: `Elder care at home is more than company — it is a structured routine that keeps seniors safe, dignified, and medically stable. Families in Lucknow often combine family supervision with professional GDA attendants or elder-trained nurses for peace of mind.

Start with a simple safety audit: remove trip hazards, ensure night lighting, store medications in labelled boxes, and agree on a daily hydration and meal schedule. For elders with dementia or memory issues, consistent caregivers and fixed routines reduce anxiety.

Hygiene support should respect privacy — bathing, oral care, linen changes, and toileting assistance are common GDA duties. Watch for skin integrity, especially on bedridden patients; repositioning and gentle skin care prevent pressure sores.

Mobility matters. Encourage safe transfers with gait belts or walker support as advised by physiotherapy. Never rush standing from bed; attendants trained by Mson Nursing Services follow fall-prevention basics families sometimes overlook.

Medication reminders must align with the physician's chart — attendants remind and observe; nurses administer where licensed. Keep an updated list of doctors, allergies, and emergency contacts on the refrigerator or WhatsApp family group.

Social connection reduces depression. Schedule short walks, prayer time, or video calls with relatives. A compassionate caregiver who speaks the elder's language makes a measurable difference in mood and cooperation.

If care needs increase — night wandering, two-person transfers, or post-hospital recovery — upgrade from part-time GDA to longer shifts or nurse-led supervision. Our coordinators help you scale without changing agencies.`,
    faq: [
      {
        q: "How many hours of elder care should we book?",
        a: "It depends on mobility and supervision needs. Many families start with 12-hour day or night GDA duty and adjust after a week. Mson Nursing Services can advise based on your situation.",
      },
      {
        q: "Do elder care attendants handle cooking and housekeeping?",
        a: "Light meal support and tidying related to the patient are common. Full household cooking varies by assignment — clarify expectations when booking.",
      },
      {
        q: "Can elder care staff stay during family travel?",
        a: "Yes — respite and live-in style coverage is available in Lucknow when you plan in advance.",
      },
    ],
    relatedServiceIds: ["elderly-care-service", "elder-care-nurse", "gda-male-and-female-12-hours"],
  },
  "injection-iv-services-at-home": {
    body: `Visit-based nursing brings injections, IV fluids, wound dressing, and catheter care to your doorstep in Lucknow — useful after discharge, for chronic conditions, or when clinic visits are difficult for elders.

Typical visit services include IM injections, tetanus (TT) shots, IV cannula insertion, saline drips, vitals check, and simple wound dressing. Always share the doctor's prescription, last dose timing, and any allergies before the nurse arrives.

Consumables such as IV sets, syringes, and dressings may be billed separately from the visit fee. Mson Nursing Services explains inclusions before confirming so families are not surprised on arrival.

Prepare a clean, well-lit area with access to a chair or bed, running water, and the patient's records. Keep pets secured and ensure an adult family member is present for consent and handover.

After IV or injection visits, nurses observe for immediate reactions and advise on signs that need emergency care. For elders on multiple injections, a printed schedule on the wall helps attendants and family stay aligned between nurse visits.

Catheter and advanced wound care require skilled nurses — do not ask untrained helpers to perform clinical procedures. Book registered nurses for these tasks and GDA staff for ongoing monitoring between visits.

To book, share patient location in Lucknow, prescription photo, and preferred time window. Same-day visits are often possible for straightforward injections when a nurse is available in your zone.`,
    faq: [
      {
        q: "Are medical consumables included in the nurse visit fee?",
        a: "Usually the visit fee covers professional service. Consumables are often charged separately — our coordinator confirms before booking.",
      },
      {
        q: "Can a nurse give IV drip at home in Lucknow?",
        a: "Yes, with a valid prescription and safe setup. A registered nurse from Mson Nursing Services can administer IV fluids as directed by your physician.",
      },
      {
        q: "Is tetanus (TT) injection available as a home visit?",
        a: "Yes. Book a visit-based nurse and share prior vaccination history if known.",
      },
    ],
    relatedServiceIds: ["medical-care-nurse", "registered-nurses-12-hours", "home-health-care-service"],
  },
};

const newPosts = [
  {
    id: "post-surgery-recovery-at-home",
    title: "Post-Surgery Recovery at Home: What Families Should Plan",
    excerpt: "Nursing checkpoints after hospital discharge — wound care, mobility, medication, and when to call a nurse visit in Lucknow.",
    category: "Home Nursing",
    date: "2026-02-10",
    featured: false,
    relatedServiceIds: ["home-health-care-service", "registered-nurses-12-hours", "gda-male-and-female-12-hours"],
  },
  {
    id: "choosing-gda-staff-lucknow",
    title: "How to Choose GDA Male & Female Staff in Lucknow",
    excerpt: "Interview questions, shift patterns, and red flags when hiring patient care attendants for home duty.",
    category: "Home Nursing",
    date: "2026-01-28",
    featured: false,
    relatedServiceIds: ["gda-male-and-female-12-hours", "home-health-care-service"],
  },
  {
    id: "dementia-care-routines-home",
    title: "Dementia Care Routines at Home: Calm Days for Seniors",
    excerpt: "Structure, communication, and caregiver tips when a parent has memory loss or confusion.",
    category: "Elder Care",
    date: "2026-01-15",
    featured: false,
    relatedServiceIds: ["elderly-care-service", "elder-care-nurse"],
  },
  {
    id: "newborn-care-at-home-lucknow",
    title: "Newborn & Mother Care at Home in Lucknow",
    excerpt: "Night support, feeding routines, and hygiene when bringing baby home from hospital.",
    category: "Home Nursing",
    date: "2025-12-20",
    featured: false,
    relatedServiceIds: ["home-health-care-service", "gda-male-and-female-12-hours"],
  },
  {
    id: "wound-dressing-home-nurse",
    title: "Wound Dressing at Home: When to Book a Skilled Nurse",
    excerpt: "Surgical wounds, bedsores, and infection signs — what trained nurses handle during home visits.",
    category: "Clinical Visits",
    date: "2025-12-05",
    featured: false,
    relatedServiceIds: ["medical-care-nurse", "registered-nurses-12-hours"],
  },
  {
    id: "night-duty-elder-care",
    title: "Night Duty Elder Care: Sleep Safety for Seniors",
    excerpt: "Why families book night GDA or nurse cover — bathroom assistance, fall risk, and medication timing.",
    category: "Elder Care",
    date: "2025-11-18",
    featured: false,
    relatedServiceIds: ["elderly-care-service", "gda-male-and-female-12-hours"],
  },
];

const bodyTemplate = (title) =>
  `${title} is a common topic for families searching nursing support in Lucknow. Professional home care reduces hospital readmissions, keeps elders comfortable, and gives relatives confidence when they cannot stay home full time.

Mson Nursing Services coordinates verified staff, explains pricing before duty starts, and supports replacements if schedules change. Share patient details, locality, and hours needed — our team matches GDA attendants or registered nurses accordingly.

Every home is different. Document allergies, doctors, and emergency contacts. Keep prescriptions accessible and agree on a single family contact for the caregiver to call during shifts.

When in doubt, speak to our coordinator — we help you choose visit-based clinical care versus long-term attendant duty without pressure to overbook.`;

const faqTemplate = [
  {
    q: "How do I book care related to this topic?",
    a: "Call Mson Nursing Services or submit the website contact form with patient age, location in Lucknow, and preferred timing.",
  },
  {
    q: "Are staff verified before home duty?",
    a: "Yes — we coordinate identity verification and orientation on safety, dignity, and reporting to family.",
  },
];

for (const post of content.posts || []) {
  const patch = enrich[post.id];
  if (patch) {
    post.body = patch.body;
    post.faq = patch.faq;
    post.relatedServiceIds = patch.relatedServiceIds;
  }
}

const existingIds = new Set((content.posts || []).map((p) => p.id));
for (const np of newPosts) {
  if (existingIds.has(np.id)) continue;
  content.posts.push({
    ...np,
    author: "Mson Nursing Services",
    published: true,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80",
    body: bodyTemplate(np.title),
    faq: faqTemplate,
    seo: {
      title: `${np.title} | Blog | Mson Nursing Services`,
      description: np.excerpt,
      keywords: `${np.category}, nursing blog, Lucknow, home healthcare`,
      canonicalPath: `/blog/${np.id}`,
    },
  });
}

writeFileSync(file, `${JSON.stringify(content, null, 2)}\n`, "utf-8");
console.log("Blog posts enriched. Total posts:", content.posts.length);
