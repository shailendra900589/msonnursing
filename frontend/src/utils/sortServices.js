export function sortServices(services = []) {
  return [...services].sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
}
