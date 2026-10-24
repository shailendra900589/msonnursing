function localDigits(raw) {
  const digits = String(raw || "").replace(/\D/g, "");
  if (digits.length > 10) return digits.slice(-10);
  return digits;
}

export function phoneHref(raw) {
  const local = localDigits(raw);
  return local.length === 10 ? `tel:+91${local}` : `tel:${String(raw || "").replace(/\s/g, "")}`;
}

export function formatPhone(raw) {
  const local = localDigits(raw);
  if (local.length !== 10) return String(raw || "");
  return `+91 ${local}`;
}
