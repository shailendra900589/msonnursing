import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

function collectCssHrefs(entry) {
  const hrefs = [];
  const seen = new Set();
  const walk = (mod) => {
    if (!mod || seen.has(mod)) return;
    seen.add(mod);
    const id = mod.id || mod.url || "";
    if (mod.type === "css" || id.split("?")[0].endsWith(".css")) {
      const href = String(mod.url || "").split("?")[0];
      if (href.startsWith("/") && !hrefs.includes(href)) hrefs.push(href);
    }
    const children = mod.ssrImportedModules || mod.importedModules;
    for (const child of children || []) walk(child);
  };
  walk(entry);
  const first = ["/src/index.css", "/src/styles/animations.css"];
  return [...first.filter((href) => hrefs.includes(href)), ...hrefs.filter((href) => !first.includes(href))];
}

let cachedCss = "";

async function buildDevCss(server) {
  const entry = await server.moduleGraph.getModuleByUrl("/src/entry-server.jsx", true);
  const hrefs = collectCssHrefs(entry);
  const chunks = [];
  for (const href of hrefs) {
    const result = await server.transformRequest(`${href}?direct`);
    if (result?.code) chunks.push(result.code);
  }
  cachedCss = chunks.join("\n");
  return cachedCss;
}

function isPageRequest(url) {
  const pathname = url.split("?")[0];
  if (pathname.startsWith("/@")) return false;
  if (pathname.startsWith("/src/")) return false;
  if (pathname.startsWith("/node_modules/")) return false;
  if (pathname.startsWith("/api")) return false;
  if (pathname.startsWith("/uploads")) return false;
  if (pathname.startsWith("/admin")) return false;
  if (pathname.startsWith("/preview")) return false;
  if (pathname.includes(".")) return false;
  return true;
}

export function ssrDevPlugin(repoRoot, frontendRoot) {
  const indexPath = path.join(frontendRoot, "index.html");
  const contentModule = pathToFileURL(path.join(repoRoot, "backend", "src", "utils", "contentStore.js")).href;

  return {
    name: "mson-ssr",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        try {
          const url = req.url || "/";
          const pathname = url.split("?")[0] || "/";

          if (req.method === "GET" || req.method === "HEAD") {
            if (pathname === "/__ssr_css") {
              res.statusCode = 200;
              res.setHeader("Content-Type", "text/css; charset=utf-8");
              res.setHeader("Cache-Control", "no-store");
              res.end(req.method === "HEAD" ? undefined : cachedCss);
              return;
            }
            if (pathname === "/__ssr_data") {
              const { getContent } = await import(contentModule);
              const data = JSON.stringify(getContent()).replace(/</g, "\\u003c");
              res.statusCode = 200;
              res.setHeader("Content-Type", "text/javascript; charset=utf-8");
              res.setHeader("Cache-Control", "no-store");
              res.end(req.method === "HEAD" ? undefined : `window.__SSR_DATA=${data};`);
              return;
            }
          }

          if ((req.method !== "GET" && req.method !== "HEAD") || !isPageRequest(url)) {
            next();
            return;
          }

          const { getContent } = await import(contentModule);
          const content = getContent();
          let template = fs.readFileSync(indexPath, "utf8");
          template = await server.transformIndexHtml(url, template);
          const { render } = await server.ssrLoadModule("/src/entry-server.jsx");
          const rendered = render(pathname, content);
          await buildDevCss(server);
          const html = template
            .replace("<!--ssr-css-->", `<link rel="stylesheet" href="/__ssr_css" />`)
            .replace("<!--ssr-head-->", rendered.head)
            .replace("<!--ssr-html-->", rendered.html)
            .replace("<!--ssr-data-->", `<script src="/__ssr_data"></script>`);

          res.statusCode = 200;
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.end(req.method === "HEAD" ? undefined : html);
        } catch (error) {
          server.ssrFixStacktrace?.(error);
          next(error);
        }
      });
    },
  };
}
