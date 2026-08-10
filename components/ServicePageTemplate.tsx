import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollAnimations from "@/components/ScrollAnimations";

const SITE_URL = "https://envirocycleglasgow.com";

export type ServiceFAQ = { q: string; a: string };
export type ServiceSection = { heading: string; body: string[] };
export type RelatedService = { href: string; label: string };

export interface ServicePageTemplateProps {
  /** URL path, e.g. "/services/waste-management" */
  slug: string;
  /** Small label above the H1 */
  eyebrow: string;
  /** Main H1 text (non-accented part) */
  title: string;
  /** Accented (gold) part of the H1 */
  titleAccent: string;
  /** One or two sentences under the H1 */
  intro: string;
  /** Body content blocks */
  sections: ServiceSection[];
  /** Bullet feature list */
  features: string[];
  /** FAQ entries — also output as FAQPage structured data */
  faqs: ServiceFAQ[];
  /** Internal links to sibling service pages */
  related: RelatedService[];
}

export default function ServicePageTemplate({
  slug,
  eyebrow,
  title,
  titleAccent,
  intro,
  sections,
  features,
  faqs,
  related,
}: ServicePageTemplateProps) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: `${title} ${titleAccent}`.trim(),
        item: `${SITE_URL}${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <ScrollAnimations />
      <Navbar />

      <main
        className="min-h-screen pt-24 pb-20"
        style={{ background: "var(--forest-dark)" }}
      >
        {/* ---------- Hero ---------- */}
        <section
          className="relative py-20 px-6 text-center overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(26,68,29,0.3) 0%, transparent 100%)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 0%, rgba(212,160,23,0.08) 0%, transparent 70%)",
            }}
          />
          {/* Breadcrumb */}
          <nav
            className="relative text-xs tracking-widest uppercase mb-6"
            style={{ color: "rgba(245,240,232,0.4)" }}
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-[var(--gold-light)]">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span style={{ color: "rgba(212,160,23,0.7)" }}>
              {title} {titleAccent}
            </span>
          </nav>

          <p className="section-label mb-4">{eyebrow}</p>
          <h1
            className="text-4xl md:text-6xl font-heading tracking-wider mb-6"
            style={{ fontFamily: "var(--font-heading)", color: "var(--cream)" }}
          >
            {title} <span className="gold-text">{titleAccent}</span>
          </h1>
          <p
            className="max-w-2xl mx-auto text-base md:text-lg leading-relaxed"
            style={{ color: "rgba(245,240,232,0.7)" }}
          >
            {intro}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Link
              href="/book"
              className="inline-flex items-center justify-center gap-3 font-semibold px-8 py-3.5 rounded-full"
              style={{
                background: "linear-gradient(135deg, #d4a017, #f0c040)",
                color: "#0a1f0b",
                boxShadow: "0 8px 32px rgba(212,160,23,0.3)",
              }}
            >
              Book Now
            </Link>
            <a
              href="tel:+447450435241"
              className="inline-flex items-center justify-center gap-3 font-semibold px-8 py-3.5 rounded-full border"
              style={{
                background: "rgba(255,255,255,0.05)",
                borderColor: "rgba(245,240,232,0.18)",
                color: "var(--cream)",
              }}
            >
              +44 7450 435241
            </a>
          </div>
        </section>

        {/* ---------- Body sections ---------- */}
        <div className="max-w-3xl mx-auto px-6 mt-12 space-y-12">
          {sections.map((section) => (
            <article key={section.heading} className="animate-on-scroll">
              <h2
                className="text-2xl md:text-3xl font-heading mb-4"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--gold-light)",
                  letterSpacing: "0.04em",
                }}
              >
                {section.heading}
              </h2>
              {section.body.map((para, i) => (
                <p
                  key={i}
                  className="leading-relaxed mb-4"
                  style={{ color: "rgba(245,240,232,0.75)" }}
                >
                  {para}
                </p>
              ))}
            </article>
          ))}

          {/* Features */}
          <div className="gold-card rounded-2xl p-6 md:p-8 animate-on-scroll">
            <h2
              className="text-xl md:text-2xl font-heading mb-5"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--cream)",
                letterSpacing: "0.04em",
              }}
            >
              What&apos;s included
            </h2>
            <ul className="space-y-3">
              {features.map((feat) => (
                <li
                  key={feat}
                  className="flex items-start gap-3 leading-relaxed"
                  style={{ color: "rgba(245,240,232,0.78)" }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--gold)"
                    strokeWidth="2.5"
                    className="shrink-0 mt-1"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {feat}
                </li>
              ))}
            </ul>
          </div>

          {/* FAQ */}
          <section className="animate-on-scroll">
            <h2
              className="text-2xl md:text-3xl font-heading mb-6"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--gold-light)",
                letterSpacing: "0.04em",
              }}
            >
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div
                  key={faq.q}
                  className="gold-card rounded-2xl p-6"
                >
                  <h3
                    className="text-base font-semibold mb-2"
                    style={{ color: "var(--cream)" }}
                  >
                    {faq.q}
                  </h3>
                  <p
                    className="leading-relaxed text-sm"
                    style={{ color: "rgba(245,240,232,0.7)" }}
                  >
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Related services — internal linking */}
          {related.length > 0 && (
            <section className="animate-on-scroll">
              <h2
                className="text-xl md:text-2xl font-heading mb-5"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--cream)",
                  letterSpacing: "0.04em",
                }}
              >
                Other services
              </h2>
              <div className="flex flex-wrap gap-3">
                {related.map((r) => (
                  <Link
                    key={r.href}
                    href={r.href}
                    className="px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
                    style={{
                      background: "rgba(212,160,23,0.1)",
                      border: "1px solid rgba(212,160,23,0.3)",
                      color: "var(--gold-light)",
                    }}
                  >
                    {r.label} →
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Closing CTA */}
          <div
            className="rounded-2xl p-8 text-center animate-on-scroll"
            style={{
              background:
                "linear-gradient(145deg, rgba(212,160,23,0.12), rgba(212,160,23,0.05))",
              border: "1.5px solid rgba(212,160,23,0.3)",
            }}
          >
            <h2
              className="text-2xl font-heading mb-3"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--cream)",
              }}
            >
              Need this sorted in Glasgow?
            </h2>
            <p
              className="text-sm mb-6 max-w-md mx-auto"
              style={{ color: "rgba(245,240,232,0.65)" }}
            >
              Get a free, no-obligation quote. We usually respond within a few
              hours and same-day slots are often available.
            </p>
            <Link
              href="/book"
              className="inline-flex items-center justify-center gap-3 font-semibold px-8 py-3.5 rounded-full"
              style={{
                background: "linear-gradient(135deg, #d4a017, #f0c040)",
                color: "#0a1f0b",
              }}
            >
              Book Now
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}