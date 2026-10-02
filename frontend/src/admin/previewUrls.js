export function buildPreviewSrc(path) {
  const route = path === "/" ? "" : path;
  return `/preview${route}?embed=1`;
}

export function formatPreviewPath(path) {
  if (!path || path === "/") return null;
  return path;
}
