import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useContent } from "../context/ContentContext.jsx";
import { resolveShareMeta } from "../utils/shareMeta.js";
import { buildStructuredData, businessGeo } from "../utils/structuredData.js";

function buildUrl(siteUrl, path) {
  const base = String(siteUrl || "").replace(/\/$/, "");
  const clean = path?.startsWith("/") ? path : `/${path || ""}`;
  return base ? `${base}${clean}` : clean;
}

export default function Seo({
  pageKey,
  service,
  event,
  post,
  job,
  noindex = false,
  title: titleOverride,
  description: descriptionOverride,
}) {
  const { content } = useContent();
  const location = useLocation();
  const meta = resolveShareMeta({ content, pageKey, service, event, post, job });
  if (!meta || !content) return null;

  if (noindex) {
    meta.canonical = buildUrl(content.site?.url, location.pathname);
    meta.canonicalPath = location.pathname;
  }
  if (titleOverride) meta.title = titleOverride;
  if (descriptionOverride) meta.description = descriptionOverride;

  const defaults = content.seo?.default || {};
  const item = event || service || post || job;
  const itemMeta = item?.seo || {};
  const blocks = buildStructuredData({ content, meta, pageKey, service, event, post, job, noindex });
  const geo = businessGeo(content);
  const htmlLang = (meta.locale || "en_IN").split("_")[0] || "en";
  const robots = noindex
    ? "noindex, nofollow"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

  return (
    <Helmet htmlAttributes={{ lang: htmlLang }}>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      {meta.keywords ? <meta name="keywords" content={meta.keywords} /> : null}
      {itemMeta.tags ? <meta name="news_keywords" content={itemMeta.tags} /> : null}
      <meta name="geo.region" content="IN-UP" />
      <meta name="geo.placename" content={itemMeta.geoCity || "Lucknow"} />
      {geo ? <meta name="geo.position" content={`${geo.latitude};${geo.longitude}`} /> : null}
      {geo ? <meta name="ICBM" content={`${geo.latitude}, ${geo.longitude}`} /> : null}
      {itemMeta.aeoSummary ? <meta name="abstract" content={itemMeta.aeoSummary} /> : null}
      <meta name="robots" content={robots} />
      <link rel="canonical" href={meta.canonical} />
      {noindex ? null : <link rel="alternate" hrefLang="en-IN" href={meta.canonical} />}
      {noindex ? null : <link rel="alternate" hrefLang="x-default" href={meta.canonical} />}
      <link rel="sitemap" type="application/xml" href="/api/sitemap.xml" />
      {noindex ? null : <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM site guide" />}

      <meta property="og:type" content={meta.ogType} />
      <meta property="og:site_name" content={defaults.siteName || content.site.name} />
      <meta property="og:locale" content={meta.locale} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={meta.canonical} />
      {meta.ogImage ? (
        <>
          <meta property="og:image" content={meta.ogImage} />
          <meta property="og:image:secure_url" content={meta.ogImage} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content={meta.ogImageAlt} />
        </>
      ) : null}

      {meta.article?.publishedTime ? (
        <meta property="article:published_time" content={meta.article.publishedTime} />
      ) : null}
      {meta.article?.author ? <meta property="article:author" content={meta.article.author} /> : null}
      {meta.article?.section ? <meta property="article:section" content={meta.article.section} /> : null}
      {meta.article?.tags?.map((tag) => (
        <meta property="article:tag" content={tag} key={tag} />
      ))}

      <meta name="twitter:card" content={meta.twitterCard} />
      {meta.twitterSite ? <meta name="twitter:site" content={meta.twitterSite} /> : null}
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      {meta.ogImage ? <meta name="twitter:image" content={meta.ogImage} /> : null}
      {meta.ogImageAlt ? <meta name="twitter:image:alt" content={meta.ogImageAlt} /> : null}
      {meta.twitterLabel1 ? <meta name="twitter:label1" content={meta.twitterLabel1} /> : null}
      {meta.twitterData1 ? <meta name="twitter:data1" content={meta.twitterData1} /> : null}
      {meta.twitterLabel2 ? <meta name="twitter:label2" content={meta.twitterLabel2} /> : null}
      {meta.twitterData2 ? <meta name="twitter:data2" content={meta.twitterData2} /> : null}

      {blocks.map((block) => (
        <script type="application/ld+json" key={block["@graph"]?.[0]?.["@type"] || "graph"}>
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  );
}
