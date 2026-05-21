import { areas, getCombosForArea } from "@/lib/areas";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";

// ────────────────────────────────────────────────────────────────────────────
// SERVICE HUB CONFIG
// ────────────────────────────────────────────────────────────────────────────
// Clone this file for each of the 8 services. The only differences between
// service hubs are these constants — everything below the line is shared.

const SERVICE_PREFIX = "rubbish-removal";
const SERVICE_NAME = "Rubbish Removal";
const SERVICE_H1 = "RUBBISH REMOVAL";
const HERO_TAGLINE = "Single items to full van loads — cheaper than a skip, faster than the council.";

const META_TITLE = "Rubbish Removal Glasgow | Same-Day Service from £40 | Envirocycle";
const META_DESCRIPTION = "Licensed rubbish removal across Glasgow and surrounding areas. Single sofas to full house clearances. Same-day available, transfer note included.";

const WHAT_WE_TAKE = [
  "Furniture — sofas, beds, wardrobes, dining sets",
  "White goods — fridges, washing machines, dryers",
  "Garden waste — branches, hedge cuttings, soil, turf",
  "Builders' waste — kitchens, bathrooms, plasterboard",
  "Office equipment — desks, chairs, filing cabinets, IT (WEEE)",
  "General clutter — boxes, bags, broken items, end-of-tenancy",
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Quick quote",
    body: "Send a photo of what needs to go and your postcode. We'll quote in minutes — no site visit needed for most jobs.",
  },
  {
    step: "02",
    title: "Pick a slot",
    body: "Same-day or next-day usually available. Two-hour arrival window so you're not waiting around.",
  },
  {
    step: "03",
    title: "We load & go",
    body: "Two-person team, fully insured. We do the lifting. You get a transfer note and a clean space.",
  },
  {
    step: "04",
    title: "Properly disposed",
    body: "Everything sorted at a licensed transfer station. Reusable items to local charities, rest recycled.",
  },
];

const FAQ = [
  {
    q: "How much does rubbish removal cost?",
    a: "Pricing is by volume (van space) rather than per item, so larger jobs work out cheaper. A single mattress is around £40; a full van load is £200–£280 depending on what's in it. We always quote up front — no surprises.",
  },
  {
    q: "Can you come today?",
    a: "Usually yes, if you call before 11am. Send a photo and a postcode and we'll tell you straight away if we can fit you in.",
  },
  {
    q: "Do you need access to drive into the property?",
    a: "Not always. We can carry items out from a flat, a garden, a garage, or up to a kerbside parking spot. For trickier access (stairs, narrow paths, no parking) we'll factor it into the quote.",
  },
  {
    q: "What about hazardous waste?",
    a: "We can take most household items including paints, batteries, and electricals (WEEE). We can't take asbestos, clinical waste, or chemicals — call us if you're unsure and we'll point you in the right direction.",
  },
  {
    q: "Is it cheaper than a skip?",
    a: "For most domestic jobs, yes — by quite a bit. A skip is the same price whether full or half-empty, and you need a permit if it's on the road. We turn up, load, and leave — you pay for what we actually take.",
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

  return (
    <main className="min-h-screen">
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
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-3 font-semibold px-8 py-4 rounded-full"
            style={{
              background: "linear-gradient(135deg, #d4a017, #f0c040)",
              color: "#0a1f0b",
              boxShadow: "0 8px 32px rgba(212,160,23,0.3)",
            }}
          >
            Get a Free Quote
          </a>
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
