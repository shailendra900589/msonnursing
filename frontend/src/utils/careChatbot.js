/** Most common home-nursing enquiries (order = show first in chat UI). */
export const POPULAR_SERVICE_IDS = [
  "gda-male-and-female-12-hours",
  "elderly-care-service",
  "home-health-care-service",
  "registered-nurses-12-hours",
  "medical-care-nurse",
  "elder-care-nurse",
];

export function getChatQuickPrompts(content) {
  const services = content?.services || [];
  const prompts = [];
  for (const id of POPULAR_SERVICE_IDS) {
    const s = services.find((x) => x.id === id);
    if (!s) continue;
    const short = s.title.replace(/\s*\([^)]*\)\s*/g, "").trim();
    prompts.push({
      label: short.length > 28 ? `${short.slice(0, 26)}…` : short,
      query: `${s.title} price and booking in Lucknow`,
      serviceId: s.id,
    });
    if (prompts.length >= 6) break;
  }
  if (prompts.length < 4) {
    prompts.push(
      { label: "Service prices", query: "home nursing service prices Lucknow" },
      { label: "Contact & phone", query: "contact phone number" }
    );
  }
  return prompts.slice(0, 6);
}

function tokenize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

function scoreText(queryTokens, haystack) {
  const text = haystack.toLowerCase();
  let score = 0;
  for (const t of queryTokens) {
    if (text.includes(t)) score += 1;
  }
  if (text.includes(queryTokens.join(" "))) score += 3;
  return score;
}

export function buildKnowledgeBase(content) {
  const items = [];
  for (const s of content.services || []) {
    items.push({
      kind: "service",
      title: s.title,
      snippet: s.shortDescription || s.description || "",
      price: s.price,
      link: `/services/${s.id}`,
      text: [s.title, s.shortDescription, s.description, s.price, s.priceNote, ...(s.features || [])].join(" "),
    });
  }
  for (const p of (content.posts || []).filter((x) => x.published !== false)) {
    items.push({
      kind: "blog",
      title: p.title,
      snippet: p.excerpt || "",
      link: `/blog/${p.id}`,
      text: [p.title, p.excerpt, p.category, p.body].join(" "),
    });
  }
  for (const e of (content.events || []).filter((x) => x.published !== false)) {
    items.push({
      kind: "event",
      title: e.title,
      snippet: e.shortDescription || e.description || "",
      link: `/events/${e.id}`,
      text: [e.title, e.shortDescription, e.description, e.location, e.date].join(" "),
    });
  }
  return items;
}

export function answerCareQuery(query, content) {
  const siteName = content.site?.name || "Mson Nursing Services";
  const city = content.site?.location?.split(",")[0]?.trim() || "Lucknow";
  const phone = content.contact?.phones?.[0] || "";
  const email = content.contact?.email || "";
  const q = query.trim();
  const tokens = tokenize(q);

  if (!q) {
    return {
      type: "reply",
      message: `Namaste! I am the ${siteName} assistant. Ask about services, prices, elder care, home nurses, blog guides, or events in ${city}.`,
    };
  }

  if (/^(hi|hello|hey|namaste|good\s*(morning|evening|afternoon))\b/i.test(q)) {
    return {
      type: "reply",
      message: `Hello! I can help with ${siteName} services, blog articles, and events in ${city}. What care do you need at home?`,
    };
  }

  if (/price|cost|rate|fees|charge|kitna|pricing/.test(q.toLowerCase())) {
    const priced = (content.services || []).filter((s) => s.price).slice(0, 4);
    if (priced.length) {
      const lines = priced.map((s) => `• ${s.title}: ${s.price}${s.priceNote ? ` (${s.priceNote})` : ""}`);
      return {
        type: "reply",
        message: `Here are sample visit/duty rates (confirm on call):\n${lines.join("\n")}\n\nCall ${phone} for exact quote for your case.`,
        links: priced.slice(0, 3).map((s) => ({ label: s.title, to: `/services/${s.id}` })),
      };
    }
  }

  if (/phone|call|whatsapp|contact|number|email|reach/.test(q.toLowerCase())) {
    return {
      type: "reply",
      message: `Contact ${siteName}:\n• Phone: ${phone}\n• Email: ${email}\n• Hours: ${content.contact?.hours || "Mon–Sun"}\n• Address: ${content.contact?.address || city}`,
    };
  }

  if (/service|nurse|gda|injection|iv|elder|caretaker|attendant|physio|baby/.test(q.toLowerCase())) {
    const kb = buildKnowledgeBase(content);
    let best = null;
    let bestScore = 0;
    for (const item of kb) {
      if (item.kind !== "service") continue;
      const sc = scoreText(tokens, item.text);
      if (sc > bestScore) {
        bestScore = sc;
        best = item;
      }
    }
    if (best && bestScore >= 1) {
      return {
        type: "reply",
        message: `${best.title}: ${best.snippet}${best.price ? `\nIndicative price: ${best.price}` : ""}\n\nBook via enquiry or call ${phone}.`,
        links: [{ label: "View service", to: best.link }],
      };
    }
  }

  if (/blog|article|guide|tips|read/.test(q.toLowerCase())) {
    const kb = buildKnowledgeBase(content).filter((i) => i.kind === "blog");
    let best = null;
    let bestScore = 0;
    for (const item of kb) {
      const sc = scoreText(tokens, item.text);
      if (sc > bestScore) {
        bestScore = sc;
        best = item;
      }
    }
    if (best && bestScore >= 1) {
      return {
        type: "reply",
        message: `You may find this helpful: "${best.title}" — ${best.snippet}`,
        links: [{ label: "Read article", to: best.link }],
      };
    }
  }

  if (/event|camp|campaign|register/.test(q.toLowerCase())) {
    const kb = buildKnowledgeBase(content).filter((i) => i.kind === "event");
    let best = null;
    let bestScore = 0;
    for (const item of kb) {
      const sc = scoreText(tokens, item.text);
      if (sc > bestScore) {
        bestScore = sc;
        best = item;
      }
    }
    if (best && bestScore >= 1) {
      return {
        type: "reply",
        message: `${best.title}: ${best.snippet}`,
        links: [{ label: "Event details", to: best.link }],
      };
    }
  }

  const kb = buildKnowledgeBase(content);
  let best = null;
  let bestScore = 0;
  for (const item of kb) {
    const sc = scoreText(tokens, item.text);
    if (sc > bestScore) {
      bestScore = sc;
      best = item;
    }
  }

  if (best && bestScore >= 2) {
    return {
      type: "reply",
      message: `Based on your question, this is closest:\n${best.title} — ${best.snippet}`,
      links: [{ label: "Open page", to: best.link }],
    };
  }

  return {
    type: "lead",
    message: `I could not find exact details for that in our ${city} catalog. Please share your name, mobile number, and requirement — our care team will connect within **24 hours** (any time).`,
  };
}
