/** Build wa.me link for Indian numbers (10-digit or already prefixed). */
export function whatsappUrl(number, message = "") {
  if (!number) return null;
  let digits = String(number).replace(/\D/g, "");
  if (digits.length === 10) digits = `91${digits}`;
  if (digits.length < 11) return null;
  const base = `https://wa.me/${digits}`;
  const text = message?.trim();
  if (!text) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}
