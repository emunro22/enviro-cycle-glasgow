import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import { blogPosts, blogCategories } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Blog | Waste Management Tips & Guides",
  description:
    "Expert waste management tips, disposal guides, and recycling advice for Glasgow homes and businesses. Stay informed with Envirocycle Glasgow.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog | Waste Management Tips & Guides | Envirocycle Glasgow",
    description:
      "Expert waste management tips, disposal guides, and recycling advice for Glasgow homes and businesses.",
    url: "/blog",
    siteName: "Envirocycle Glasgow",
    locale: "en_GB",
    type: "website",
  },
};

export default function BlogPage() {
  const sortedPosts = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const postsByCategory = blogCategories.reduce<
    Record<string, typeof blogPosts>
  >((acc, cat) => {
    const posts = sortedPosts.filter((p) => p.category === cat);
    if (posts.length > 0) acc[cat] = posts;
    return acc;
  }, {});

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16 px-5 md:px-8 max-w-7xl mx-auto">
        <nav
          className="mb-6 text-xs tracking-widest uppercase"
          style={{ color: "rgba(245,240,232,0.45)" }}
        >
          <Link href="/" className="hover:text-[var(--gold-light)]">
            Home
          </Link>
          {" / "}
          <span style={{ color: "var(--gold)" }}>Blog</span>
        </nav>

        <p className="section-label mb-3">Blog</p>
        <h1
          className="leading-none mb-6"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2.4rem, 7vw, 4.5rem)",
            color: "var(--cream)",
            letterSpacing: "0.02em",
          }}
        >
          WASTE MANAGEMENT{" "}
          <span className="gold-text">TIPS & GUIDES</span>
        </h1>
        <p
          className="max-w-2xl text-base md:text-lg"
          style={{ color: "rgba(245,240,232,0.75)", lineHeight: 1.7 }}
        >
          Expert advice on waste disposal, recycling, house clearance, and
          keeping Glasgow clean. Practical guides you can actually use.
        </p>
      </section>

      {/* Posts by category */}
      {Object.entries(postsByCategory).map(([category, posts]) => (
        <section
          key={category}
          className="py-12 px-5 md:px-8 max-w-7xl mx-auto"
        >
          <h2
            className="text-sm tracking-widest uppercase mb-8"
            style={{ color: "var(--gold)" }}
          >
            {category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block rounded-2xl p-6 transition-all duration-300"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(26,68,29,0.3), rgba(10,31,11,0.5))",
                  border: "1px solid rgba(212,160,23,0.1)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(212,160,23,0.3)";
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(212,160,23,0.1)";
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(0)";
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="text-xs tracking-wider uppercase"
                    style={{ color: "var(--gold)", opacity: 0.7 }}
                  >
                    {new Date(post.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
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
                <h3
                  className="text-lg font-semibold mb-3 group-hover:text-[var(--gold-light)] transition-colors"
                  style={{ color: "var(--cream)" }}
                >
                  {post.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "rgba(245,240,232,0.6)" }}
                >
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <Contact />
      <Footer />
    </main>
  );
}
