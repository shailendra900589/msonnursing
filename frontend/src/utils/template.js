export function applyTemplate(str, vars = {}) {
  if (!str) return "";
  return String(str).replace(/\{\{(\w+)\}\}/g, (_, key) =>
    vars[key] !== undefined && vars[key] !== null ? String(vars[key]) : ""
  );
}
