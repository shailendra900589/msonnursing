import { useEffect, useMemo } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { BookOpen, ChevronLeft, ChevronRight, Search } from "lucide-react";
import Seo from "../components/Seo.jsx";
import PageHeader from "../components/PageHeader.jsx";
import PostCard from "../components/PostCard.jsx";
import CtaBanner from "../components/CtaBanner.jsx";
import "./BlogPage.css";

const PAGE_SIZE = 12;

function pageItems(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const items = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) items.push("gap-start");
  for (let i = start; i <= end; i += 1) items.push(i);
  if (end < total - 1) items.push("gap-end");
  items.push(total);
  return items;
}

export default function BlogPage() {
  const { content } = useOutletContext();
  const pageMeta = content.pages?.blog || {};
  const labels = content.labels;
  const vars = { phone: content.contact.phones[0], siteName: content.site.name };
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const requestedPage = Math.max(1, Number(searchParams.get("page")) || 1);

  const posts = useMemo(
    () =>
      (content.posts || [])
        .filter((post) => post.published !== false)
        .sort((a, b) => (b.date || "").localeCompare(a.date || "")),
    [content.posts]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((post) =>
      [post.title, post.excerpt, post.category, post.author, post.body]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [posts, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(requestedPage, pageCount);
  const start = (page - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);
  const showPagination = filtered.length > PAGE_SIZE;

  useEffect(() => {
    if (requestedPage === page) return;
    const next = new URLSearchParams(searchParams);
    if (page <= 1) next.delete("page");
    else next.set("page", String(page));
    setSearchParams(next, { replace: true });
  }, [page, requestedPage, searchParams, setSearchParams]);

  const updateQuery = (value) => {
    const next = new URLSearchParams(searchParams);
    const trimmed = value.trim();
    if (trimmed) next.set("q", value);
    else next.delete("q");
    next.delete("page");
    setSearchParams(next, { replace: true });
  };

  const goToPage = (nextPage) => {
    const target = Math.min(pageCount, Math.max(1, nextPage));
    if (target === page) return;
    const next = new URLSearchParams(searchParams);
    if (target <= 1) next.delete("page");
    else next.set("page", String(target));
    setSearchParams(next);
    document.querySelector(".blog-listing")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const rangeStart = filtered.length ? start + 1 : 0;
  const rangeEnd = Math.min(start + PAGE_SIZE, filtered.length);

  return (
    <>
      <Seo pageKey="blog" />
      <PageHeader
        title={pageMeta.title || "Blog"}
        subtitle={pageMeta.subtitle}
        breadcrumbs={[
          { label: labels?.homeBreadcrumb, to: "/" },
          { label: pageMeta.title || "Blog", to: null },
        ]}
      />
      <section className="section blog-listing">
        <div className="container">
          <div className="blog-toolbar">
            <h2 className="section-title blog-listing-title">
              <BookOpen size={22} aria-hidden /> Latest articles
            </h2>
            <label className="blog-search">
              <Search size={18} aria-hidden />
              <input
                type="search"
                value={query}
                placeholder="Search articles, topics, or care tips…"
                onChange={(e) => updateQuery(e.target.value)}
                aria-label="Search blog articles"
              />
            </label>
          </div>
          <p className="blog-result-count" aria-live="polite">
            {filtered.length ? (
              <>
                Showing <strong>{rangeStart}</strong>–<strong>{rangeEnd}</strong> of <strong>{filtered.length}</strong>{" "}
                {filtered.length === 1 ? "article" : "articles"}
                {query.trim() ? <> for “{query.trim()}”</> : null}
              </>
            ) : (
              <>No articles match “{query.trim()}”.</>
            )}
          </p>

          {visible.length ? (
            <div className="posts-grid cards-grid-4 blog-page-grid" key={`${query}-${page}`}>
              {visible.map((post, i) => (
                <PostCard key={post.id} post={post} delay={i * 45} />
              ))}
            </div>
          ) : (
            <p className="section-lead blog-empty">
              {posts.length
                ? "Try another keyword, or clear the search to see every article."
                : "New nursing care articles will appear here soon."}
            </p>
          )}

          {showPagination ? (
            <nav className="blog-pagination" aria-label="Blog pages">
              <button
                type="button"
                className="blog-page-btn blog-page-nav"
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
              >
                <ChevronLeft size={16} aria-hidden />
                Previous
              </button>
              <div className="blog-page-numbers">
                {pageItems(page, pageCount).map((item) =>
                  typeof item === "string" ? (
                    <span key={item} className="blog-page-gap" aria-hidden>
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      className={`blog-page-btn${item === page ? " is-active" : ""}`}
                      aria-current={item === page ? "page" : undefined}
                      onClick={() => goToPage(item)}
                    >
                      {item}
                    </button>
                  )
                )}
              </div>
              <button
                type="button"
                className="blog-page-btn blog-page-nav"
                onClick={() => goToPage(page + 1)}
                disabled={page >= pageCount}
              >
                Next
                <ChevronRight size={16} aria-hidden />
              </button>
            </nav>
          ) : null}
        </div>
      </section>
      <CtaBanner
        title={content.blocks?.home?.ctaTitle}
        text={content.blocks?.home?.ctaText}
        buttonLabel={content.blocks?.home?.ctaButton}
        buttonLink="/contact"
        vars={vars}
      />
    </>
  );
}
