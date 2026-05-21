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

const SERVICE_PREFIX = "builders-waste-removal";
const SERVICE_NAME = "Builders Waste Removal";
const SERVICE_H1 = "BUILDERS WASTE REMOVAL";
const HERO_TAGLINE = "Trade waste uplifts for renovations, kitchens, bathrooms, and extensions. Cheaper than a skip, no permit needed.";

const META_TITLE = "Builders Waste Removal Glasgow | Trade Uplifts | Envirocycle";
const META_DESCRIPTION = "Builders waste removal across Glasgow for trades and homeowners. Renovation, kitchen, bathroom, and extension waste. Plasterboard kept separate as required.";

const WHAT_WE_TAKE = [
  "Kitchen rip-outs — units, worktops, white goods, tiling",
  "Bathroom strip-outs — sanitaryware, tiles, old pipework",
  "Plasterboard — kept separate as required by law",
  "Inert rubble — bricks, concrete, hardcore (priced lower)",
  "Wood, MDF, skirting, doors, and frames",
  "Mixed renovation waste — sorted at a licensed transfer station",
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Trade quote",
    body: "Most trades just want a price per van load up-front. We do that — single van, double van, scheduled regular pickups, all priced clearly.",
  },
  {
    step: "02",
    title: "Flexible collection",
    body: "We can come back as often as the job needs — daily during a full kitchen fit-out is fine, or just at the end. Kerbside or driveway loading.",
  },
  {
    step: "03",
    title: "Sorted to spec",
    body: "Plasterboard is kept separate (legal requirement). Inert rubble is priced lower than mixed loads. Hazardous items (paints, batteries) are flagged and separated.",
  },
  {
    step: "04",
    title: "Compliance for clients",
    body: "Waste transfer notes provided for every load — useful when your customer asks where the waste went, or when you need it for VAT receipts.",
  },
];

const FAQ = [
  {
    q: "How much for builders waste?",
    a: "Roughly £180–£250 per van for mixed renovation waste. Inert-only loads (rubble, brick, concrete) are cheaper at £150–£180 per van because of where it goes. Plasterboard is priced separately as it has its own disposal route.",
  },
  {
    q: "Why is plasterboard priced separately?",
    a: "Plasterboard can't be tipped with general waste — it has to go to a specialist gypsum recycling facility. We bag it separately, weigh it, and price accordingly. Required by law for any UK-licensed waste carrier.",
  },
  {
    q: "Do you offer trade accounts?",
    a: "Yes. If you're doing regular renovation work, a trade account gets you a per-van rate, priority booking, monthly invoicing, and waste transfer notes filed for you (handy when HMRC come knocking).",
  },
  {
    q: "Can you collect from a tight access?",
    a: "Most of the time, yes. We're a van rather than a skip lorry, so tight tenement closes, narrow driveways, and pedestrianised streets are all fine. If access is really limited, we'll factor in extra carry distance.",
  },
  {
    q: "Same-day for emergency clearance?",
    a: "Often yes, especially if your job's overrunning and you need the waste off-site before another trade arrives. Call us — most weekdays we can fit emergency uplifts in.",
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
