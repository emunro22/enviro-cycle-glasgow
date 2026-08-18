import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import ScrollAnimations from "@/components/ScrollAnimations";
import { SITE_URL } from "@/lib/site";

const META_TITLE = "About Envirocycle Glasgow | Licensed Waste Carrier, SEPA WCR/R/3021188";
const META_DESCRIPTION =
  "Envirocycle Glasgow is a SEPA-licensed waste removal company founded in 2025 by Chris Heenan and Liam McCormick. Four-person team, £1-2m public liability insurance, 400+ jobs completed across Glasgow.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    title: META_TITLE,
    description: META_DESCRIPTION,
    url: "/about",
    siteName: "Envirocycle Glasgow",
    locale: "en_GB",
    type: "website",
  },
};

const FACTS = [
  { label: "Founded", value: "2025" },
  { label: "Team", value: "4 people" },
  { label: "Public liability insurance", value: "£1–2 million" },
  { label: "Jobs completed", value: "400+" },
  { label: "Licensing", value: "SEPA WCR/R/3021188" },
];

const FOUNDERS = [
  {
    name: "Chris Heenan",
    role: "Co-Founder",
  },
  {
    name: "Liam McCormick",
    role: "Co-Founder",
  },
];

export default function AboutPage() {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url: `${SITE_URL}/about`,
    mainEntity: { "@id": `${SITE_URL}/#organization` },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "About", item: `${SITE_URL}/about` },
    ],
  };

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <ScrollAnimations />
      <Navbar />

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16 px-5 md:px-8 max-w-7xl mx-auto">
        <nav
          className="mb-6 text-xs tracking-widest uppercase"
          style={{ color: "rgba(245,240,232,0.45)" }}
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-[var(--gold-light)]">
            Home
          </Link>
          {" / "}
          <span style={{ color: "var(--gold)" }}>About</span>
        </nav>

        <p className="section-label mb-3">About Us</p>
        <h1
          className="leading-none mb-6"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2.4rem, 7vw, 4.5rem)",
            color: "var(--cream)",
            letterSpacing: "0.02em",
          }}
        >
          WHO WE <span className="gold-text">ARE</span>
        </h1>
        <p
          className="max-w-2xl text-base md:text-lg mb-8"
          style={{ color: "rgba(245,240,232,0.75)", lineHeight: 1.7 }}
        >
          Envirocycle Glasgow is a SEPA-licensed waste removal company
          founded in 2025 by Chris Heenan and Liam McCormick. We&apos;re a
          small, hands-on team — not a call centre — covering Glasgow and
          the surrounding councils with same-day uplifts where possible.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/book"
            className="inline-flex items-center justify-center gap-3 font-semibold px-8 py-4 rounded-full"
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
            className="inline-flex items-center justify-center gap-3 font-semibold px-8 py-4 rounded-full border"
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

      {/* ── Facts grid ─────────────────────────────────────────────────────── */}
      <section
        className="py-16 md:py-20 px-5 md:px-8"
        style={{ background: "rgba(26,68,29,0.15)" }}
      >
        <div className="max-w-7xl mx-auto">
          <p className="section-label mb-3">At a Glance</p>
          <h2
            className="leading-none mb-10"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              color: "var(--cream)",
            }}
          >
            THE <span className="gold-text">FACTS</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {FACTS.map((fact) => (
              <div
                key={fact.label}
                className="gold-card rounded-2xl p-5 text-center animate-on-scroll"
              >
                <p
                  className="text-xl md:text-2xl font-heading mb-1"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--gold-light)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {fact.value}
                </p>
                <p
                  className="text-xs uppercase tracking-wider"
                  style={{ color: "rgba(245,240,232,0.5)" }}
                >
                  {fact.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Founders ───────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-5 md:px-8 max-w-7xl mx-auto">
        <p className="section-label mb-3">Founders</p>
        <h2
          className="leading-none mb-10"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            color: "var(--cream)",
          }}
        >
          BUILT BY <span className="gold-text">TWO PEOPLE</span> WHO SHOW UP
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
          {FOUNDERS.map((founder) => (
            <div
              key={founder.name}
              className="p-6 rounded-2xl"
              style={{
                background:
                  "linear-gradient(145deg, rgba(26,68,29,0.5), rgba(10,31,11,0.7))",
                border: "1px solid rgba(212,160,23,0.2)",
              }}
            >
              <h3
                className="text-xl mb-1"
                style={{
                  fontFamily: "var(--font-heading)",
                  letterSpacing: "0.04em",
                  color: "var(--cream)",
                }}
              >
                {founder.name}
              </h3>
              <p className="text-sm" style={{ color: "var(--gold)" }}>
                {founder.role}
              </p>
            </div>
          ))}
        </div>
        <p
          className="max-w-2xl mt-8 text-base leading-relaxed"
          style={{ color: "rgba(245,240,232,0.75)" }}
        >
          Envirocycle Glasgow was started to fix a specific frustration —
          waste clearance that's either overpriced, unreliable, or vague
          about where your rubbish actually ends up. Chris and Liam built
          the business around fixed, upfront pricing and full paperwork on
          every job, and it's grown to a four-person team with 400+ jobs
          completed since 2025.
        </p>
      </section>

      {/* ── Compliance & trust ────────────────────────────────────────────── */}
      <section
        className="py-16 md:py-24 px-5 md:px-8"
        style={{ background: "rgba(26,68,29,0.15)" }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div>
            <p className="section-label mb-3">Compliance</p>
            <h2
              className="leading-none mb-6"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.8rem, 4vw, 3rem)",
                color: "var(--cream)",
              }}
            >
              LICENSED &amp; <span className="gold-text">INSURED</span>
            </h2>
            <div
              className="space-y-4 text-base"
              style={{ color: "rgba(245,240,232,0.75)", lineHeight: 1.7 }}
            >
              <p>
                Envirocycle is a registered waste carrier with the Scottish
                Environment Protection Agency, licence{" "}
                <strong style={{ color: "var(--cream)" }}>
                  SEPA WCR/R/3021188
                </strong>
                . Every commercial and trade job comes with a full waste
                transfer note, so you have a compliant audit trail for where
                your waste ended up.
              </p>
              <p>
                We carry £1–2 million public liability insurance, and
                reusable items collected are donated to local charities
                rather than sent to landfill where possible.
              </p>
            </div>
          </div>

          <div
            className="p-6 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(212,160,23,0.15)",
            }}
          >
            <p
              className="text-xs tracking-widest uppercase mb-4"
              style={{ color: "var(--gold)" }}
            >
              Why Choose Envirocycle
            </p>
            <ul className="space-y-3">
              {[
                "SEPA-licensed waste carrier — WCR/R/3021188",
                "£1–2 million public liability insurance",
                "Waste transfer note on every commercial job",
                "Reusable items donated to local charities",
                "Same-day uplifts where possible",
                "Fixed, upfront pricing — no hidden charges",
              ].map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2 text-sm"
                  style={{ color: "rgba(245,240,232,0.75)" }}
                >
                  <span style={{ color: "var(--gold)" }}>✓</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Contact />
      <Footer />
    </main>
  );
}
