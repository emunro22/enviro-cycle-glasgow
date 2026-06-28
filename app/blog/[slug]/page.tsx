import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import { blogPosts, getBlogPost, getRecentPosts } from "@/lib/blog-data";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getBlogPost(params.slug);
  if (!post) return {};

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: `/blog/${post.slug}`,
      siteName: "Envirocycle Glasgow",
      locale: "en_GB",
      type: "article",
      publishedTime: post.date,
    },
  };
}

function renderContent(content: string[]) {
  return content.map((block, i) => {
    if (block.startsWith("## ")) {
      return (
        <h2
          key={i}
          className="text-xl md:text-2xl font-semibold mt-10 mb-4"
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--cream)",
          }}
        >
          {block.slice(3)}
        </h2>
      );
    }
    return (
      <p
        key={i}
        className="text-base leading-relaxed mb-5"
        style={{ color: "rgba(245,240,232,0.78)" }}
      >
        {block}
      </p>
    );
  });
}

export default function BlogPostPage({ params }: Props) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  const relatedPosts = getRecentPosts(6).filter(
    (p) => p.slug !== post.slug,
  ).slice(0, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.date,
    author: {
      "@type": "Organization",
      name: "Envirocycle Glasgow",
    },
    publisher: {
      "@type": "Organization",
      name: "Envirocycle Glasgow",
      url: "https://envirocycleglasgow.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://envirocycleglasgow.com/blog/${post.slug}`,
    },
  };

  return (
    <main className="min-h-screen">
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Hero */}
      <section className="pt-32 pb-8 md:pt-40 md:pb-12 px-5 md:px-8 max-w-4xl mx-auto">
        <nav
          className="mb-6 text-xs tracking-widest uppercase"
          style={{ color: "rgba(245,240,232,0.45)" }}
        >
          <Link href="/" className="hover:text-[var(--gold-light)]">
            Home
          </Link>
          {" / "}
          <Link href="/blog" className="hover:text-[var(--gold-light)]">
            Blog
          </Link>
          {" / "}
          <span style={{ color: "var(--gold)" }}>{post.category}</span>
        </nav>

        <div className="flex items-center gap-4 mb-5">
          <span
            className="px-3 py-1 rounded-full text-xs tracking-wider uppercase"
            style={{
              background: "rgba(212,160,23,0.1)",
              border: "1px solid rgba(212,160,23,0.2)",
              color: "var(--gold)",
            }}
          >
            {post.category}
          </span>
          <span
            className="text-xs"
            style={{ color: "rgba(245,240,232,0.5)" }}
          >
            {new Date(post.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span
            className="text-xs"
            style={{ color: "rgba(245,240,232,0.4)" }}
          >
            {post.readTime}
          </span>
        </div>

        <h1
          className="leading-tight mb-6"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.8rem, 5vw, 3rem)",
            color: "var(--cream)",
            letterSpacing: "0.01em",
          }}
        >
          {post.title}
        </h1>
      </section>

      {/* Content */}
      <article className="px-5 md:px-8 max-w-4xl mx-auto pb-16">
        {renderContent(post.content)}

        {/* CTA */}
        <div
          className="mt-12 p-8 rounded-2xl text-center"
          style={{
            background:
              "linear-gradient(145deg, rgba(26,68,29,0.4), rgba(10,31,11,0.6))",
            border: "1px solid rgba(212,160,23,0.2)",
          }}
        >
          <h3
            className="text-xl md:text-2xl font-semibold mb-3"
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--cream)",
            }}
          >
            Need help with waste removal?
          </h3>
          <p
            className="text-sm mb-6 max-w-lg mx-auto"
            style={{ color: "rgba(245,240,232,0.65)" }}
          >
            Send a photo of what needs to go and we&apos;ll quote you within
            minutes. Same-day service available across Glasgow.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-3 font-semibold px-8 py-3.5 rounded-full text-sm"
              style={{
                background: "linear-gradient(135deg, #d4a017, #f0c040)",
                color: "#0a1f0b",
              }}
            >
              Get a Free Quote
            </a>
            <a
              href="tel:+447450435241"
              className="inline-flex items-center justify-center gap-3 font-semibold px-8 py-3.5 rounded-full text-sm border"
              style={{
                background: "rgba(255,255,255,0.05)",
                borderColor: "rgba(245,240,232,0.18)",
                color: "var(--cream)",
              }}
            >
              +44 7450 435241
            </a>
          </div>
        </div>
      </article>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section
          className="py-16 px-5 md:px-8"
          style={{ background: "rgba(26,68,29,0.15)" }}
        >
          <div className="max-w-7xl mx-auto">
            <p className="section-label mb-3">Keep Reading</p>
            <h2
              className="leading-none mb-8"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.8rem, 4vw, 3rem)",
                color: "var(--cream)",
              }}
            >
              MORE <span className="gold-text">ARTICLES</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.slug}
                  href={`/blog/${rp.slug}`}
                  className="group block rounded-2xl p-6 transition-all duration-300"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(26,68,29,0.3), rgba(10,31,11,0.5))",
                    border: "1px solid rgba(212,160,23,0.1)",
                  }}
                >
                  <span
                    className="text-xs tracking-wider uppercase"
                    style={{ color: "var(--gold)", opacity: 0.7 }}
                  >
                    {rp.category}
                  </span>
                  <h3
                    className="text-lg font-semibold mt-2 mb-2 group-hover:text-[var(--gold-light)] transition-colors"
                    style={{ color: "var(--cream)" }}
                  >
                    {rp.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "rgba(245,240,232,0.6)" }}
                  >
                    {rp.excerpt}
                  </p>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all"
                style={{
                  background: "rgba(212,160,23,0.08)",
                  border: "1px solid rgba(212,160,23,0.25)",
                  color: "var(--gold-light)",
                }}
              >
                View All Articles
              </Link>
            </div>
          </div>
        </section>
      )}

      <Contact />
      <Footer />
    </main>
  );
}
