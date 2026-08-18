import { areas, getCombosForArea } from "@/lib/areas";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import { SITE_URL } from "@/lib/site";

// ────────────────────────────────────────────────────────────────────────────
// SERVICE HUB CONFIG
// ────────────────────────────────────────────────────────────────────────────
// Clone this file for each of the 8 services. The only differences between
// service hubs are these constants — everything below the line is shared.

const SERVICE_PREFIX = "skip-hire-alternative";
const SERVICE_NAME = "Skip Hire Alternative";
const SERVICE_H1 = "SKIP HIRE ALTERNATIVE";
const HERO_TAGLINE = "Don't need a skip blocking the driveway for a week. We turn up, load, and leave — pay for what we actually take.";

const META_TITLE = "Skip Hire Alternative Glasgow | No Permit Needed | Envirocycle";
const META_DESCRIPTION = "Skip hire alternative across Glasgow. Pay for what you throw out — no permits, no skip blocking the driveway. Often cheaper than a small skip.";

const WHAT_WE_TAKE = [
  "Everything you'd put in a small or midi skip",
  "Mixed household waste, garden waste, builders waste",
  "Furniture, white goods, mattresses",
  "Renovation waste — kitchen, bathroom, plasterboard",
  "Soil, turf, rubble, hardcore",
  "Single items to multiple van loads",
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Photo quote",
    body: "Send us a photo of the pile and we'll quote a flat price. No need to estimate skip sizes or guess what'll fit.",
  },
  {
    step: "02",
    title: "Book a slot",
    body: "Same-day or next-day. Two-hour window. We turn up, you don't need to be there if you've left it accessible.",
  },
  {
    step: "03",
    title: "Load and go",
    body: "Whole job typically done in 30–60 minutes. No skip dropped, no permit, no neighbours grumbling about a yellow skip outside your house for a week.",
  },
  {
    step: "04",
    title: "Sorted, not landfilled",
    body: "Everything goes to a licensed transfer station. Reusable items to charity. Transfer note provided.",
  },
];

const FAQ = [
  {
    q: "How does this compare to a skip in cost?",
    a: "For most small-to-midi jobs, we work out cheaper. A 4-yard skip is around £250–£300 plus £80–£150 for a road permit if it can't go on your drive. We're typically £180–£250 with no permit, no permit hassle, and no daily hire charges if it sits there for a week.",
  },
  {
    q: "What about really big jobs?",
    a: "For bigger projects (full renovations, large site clearances) where you're producing waste over multiple days, a skip might still make more sense. We can come back multiple times if you'd rather avoid the skip altogether — works well when you're filling gradually.",
  },
  {
    q: "Do I need a permit?",
    a: "No — we're a van, not a skip. No road permit, no driveway permit, no council paperwork. We park briefly to load and we're gone within the hour.",
  },
  {
    q: "Same as a 'man and van' service?",
    a: "Similar idea, but with full waste-carrier licensing. The risk with unlicensed man-and-van rubbish removal is fly-tipping — if your waste gets dumped in a layby with your address on it, you can be fined. We're fully licensed (SEPA WCR/R/3021188) with a transfer note on every job.",
  },
  {
    q: "Can you take heavy stuff like rubble?",
    a: "Yes. Rubble, soil, and hardcore are fine — sometimes priced slightly lower than mixed waste because of where they go. Weight matters more than volume for these so we'll quote based on a photo.",
  },
];
// ────────────────────────────────────────────────────────────────────────────
// SHARED HUB TEMPLATE (don't change below this line when cloning)
// ────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: { canonical: `/services/${SERVICE_PREFIX}` },
  openGraph: {
    title: META_TITLE,
    description: META_DESCRIPTION,
    url: `/services/${SERVICE_PREFIX}`,
    siteName: "Envirocycle Glasgow",
    locale: "en_GB",
    type: "website",
  },
};

export default function ServiceHubPage() {
  // Group areas by council for cleaner browsing
  const byCouncil = areas.reduce<Record<string, typeof areas>>((acc, a) => {
    (acc[a.council] ||= []).push(a);
    return acc;
  }, {});

  const councilOrder = [
    "South Lanarkshire",
    "North Lanarkshire",
    "Glasgow City",
    "East Renfrewshire",
    "Renfrewshire",
    "East Dunbartonshire",
    "West Dunbartonshire",
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
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
      { "@type": "ListItem", position: 2, name: SERVICE_NAME, item: `${SITE_URL}/services/${SERVICE_PREFIX}` },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: SERVICE_NAME,
    serviceType: SERVICE_NAME,
    description: HERO_TAGLINE,
    provider: { "@id": `${SITE_URL}/#business` },
    areaServed: { "@type": "AdministrativeArea", name: "Glasgow and Central Scotland" },
    url: `${SITE_URL}/services/${SERVICE_PREFIX}`,
  };

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <Navbar />

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16 px-5 md:px-8 max-w-7xl mx-auto">
        <nav
          className="mb-6 text-xs tracking-widest uppercase"
          style={{ color: "rgba(245,240,232,0.45)" }}
        >
          <Link href="/" className="hover:text-[var(--gold-light)]">
            Home
          </Link>
          {" / "}
          <span style={{ color: "var(--gold)" }}>{SERVICE_NAME}</span>
        </nav>

        <p className="section-label mb-3">Service</p>
        <h1
          className="leading-none mb-6"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2.4rem, 7vw, 4.5rem)",
            color: "var(--cream)",
            letterSpacing: "0.02em",
          }}
        >
          {SERVICE_H1.split(" ")[0]}{" "}
          <span className="gold-text">
            {SERVICE_H1.split(" ").slice(1).join(" ")}
          </span>
        </h1>

        <p
          className="max-w-2xl text-base md:text-lg mb-8"
          style={{ color: "rgba(245,240,232,0.75)", lineHeight: 1.7 }}
        >
          {HERO_TAGLINE}
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

      {/* ── What we take ───────────────────────────────────────────────────── */}
      <section
        className="py-16 md:py-24 px-5 md:px-8"
        style={{ background: "rgba(26,68,29,0.15)" }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <p className="section-label mb-3">What We Take</p>
            <h2
              className="leading-none mb-6"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.8rem, 4vw, 3rem)",
                color: "var(--cream)",
              }}
            >
              EVERYTHING <span className="gold-text">EXCEPT</span> THE KITCHEN SINK
            </h2>
            <ul className="space-y-3">
              {WHAT_WE_TAKE.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-3 text-base"
                  style={{ color: "rgba(245,240,232,0.75)" }}
                >
                  <span className="mt-1 text-[var(--gold)] shrink-0">✓</span>
                  {line}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="section-label mb-3">How It Works</p>
            <div className="space-y-4">
              {HOW_IT_WORKS.map((step) => (
                <div
                  key={step.step}
                  className="p-5 rounded-2xl flex gap-5"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(26,68,29,0.5), rgba(10,31,11,0.7))",
                    border: "1px solid rgba(212,160,23,0.15)",
                  }}
                >
                  <div
                    className="text-2xl shrink-0"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "rgba(212,160,23,0.4)",
                    }}
                  >
                    {step.step}
                  </div>
                  <div>
                    <h3
                      className="text-base mb-1 font-semibold"
                      style={{ color: "var(--gold-light)" }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: "rgba(245,240,232,0.7)" }}
                    >
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Areas covered ──────────────────────────────────────────────────── */}
      <section className="py-16 px-5 md:px-8 max-w-7xl mx-auto">
        <p className="section-label mb-3">Coverage</p>
        <h2
          className="leading-none mb-8"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            color: "var(--cream)",
          }}
        >
          {SERVICE_H1}{" "}
          <span className="gold-text">ACROSS GLASGOW</span>
        </h2>
        <p
          className="max-w-2xl text-base mb-10"
          style={{ color: "rgba(245,240,232,0.7)" }}
        >
          We cover {areas.length} areas across Greater Glasgow. Pick yours
          below for local response times and specific info, or just call us.
        </p>

        <div className="space-y-8">
          {councilOrder.map((council) => {
            const areasInCouncil = byCouncil[council];
            if (!areasInCouncil) return null;
            return (
              <div key={council}>
                <h3
                  className="text-sm tracking-widest uppercase mb-4"
                  style={{ color: "var(--gold)" }}
                >
                  {council}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {areasInCouncil.map((area) => {
                    const hasCombo = getCombosForArea(area).includes(SERVICE_PREFIX);
                    return (
                      <Link
                        key={area.slug}
                        href={hasCombo ? `/${SERVICE_PREFIX}-${area.slug}` : `/areas/${area.slug}`}
                        className="px-4 py-2 rounded-full text-sm transition-all"
                        style={{
                          background: hasCombo ? "rgba(212,160,23,0.08)" : "rgba(255,255,255,0.03)",
                          border: hasCombo ? "1px solid rgba(212,160,23,0.25)" : "1px solid rgba(245,240,232,0.1)",
                          color: hasCombo ? "var(--gold-light)" : "rgba(245,240,232,0.7)",
                        }}
                      >
                        {area.name} →
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <section
        className="py-16 md:py-24 px-5 md:px-8"
        style={{ background: "rgba(26,68,29,0.15)" }}
      >
        <div className="max-w-3xl mx-auto">
          <p className="section-label mb-3">FAQ</p>
          <h2
            className="leading-none mb-10"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              color: "var(--cream)",
            }}
          >
            QUESTIONS WE GET ASKED A LOT
          </h2>
          <div className="space-y-5">
            {FAQ.map((item, i) => (
              <details
                key={i}
                className="rounded-2xl p-6 group"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(212,160,23,0.15)",
                }}
              >
                <summary
                  className="cursor-pointer text-lg font-semibold"
                  style={{ color: "var(--cream)" }}
                >
                  {item.q}
                </summary>
                <p
                  className="mt-4 leading-relaxed"
                  style={{ color: "rgba(245,240,232,0.75)" }}
                >
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Contact />
      <Footer />
    </main>
  );
}
