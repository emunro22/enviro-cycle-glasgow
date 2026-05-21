import {
  areas,
  servicePrefixes,
  getAllSlugCombos,
  parseSlug,
  isComboInCurrentTier,
} from "@/lib/areas";
import { notFound, redirect, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";

interface PageProps {
  params: { slug: string };
}

// Reserved root-level slugs that must NOT be intercepted by this catch-all.
// If you add new top-level pages (e.g. /pricing, /about) put their slugs here.
const RESERVED_SLUGS = new Set([
  "services",
  "tip-finder",
  "terms",
  "areas",
  "api",
  "admin",
  "sitemap.xml",
  "robots.txt",
  "favicon.ico",
  "images",
  "_next",
]);

export function generateStaticParams() {
  return getAllSlugCombos().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  if (RESERVED_SLUGS.has(params.slug)) return {};
  const combo = parseSlug(params.slug);
  if (!combo) return {};

  // For retired combos (e.g. /office-clearance-paisley) we'll redirect at
  // render time, but to be safe set the canonical to the area landing page.
  if (!isComboInCurrentTier(combo.area, combo.service.prefix)) {
    return {
      alternates: { canonical: `/areas/${combo.area.slug}` },
    };
  }

  const { area, service } = combo;
  const title = `${service.searchPhrase} ${area.name} | Envirocycle Glasgow`;
  const description = `${service.searchPhrase} in ${area.name} (${area.postcodes.join(", ")}). Licensed, insured, same-day where possible. Free quote â€” Glasgow-based team.`;

  return {
    title,
    description,
    alternates: { canonical: `/${params.slug}` },
    openGraph: {
      title,
      description,
      url: `/${params.slug}`,
      siteName: "Envirocycle Glasgow",
      locale: "en_GB",
      type: "website",
    },
  };
}

export default function SeoPage({ params }: PageProps) {
  if (RESERVED_SLUGS.has(params.slug)) notFound();
  const combo = parseSlug(params.slug);
  if (!combo) notFound();

  // If this combo was previously generated but is no longer in the active
  // tier, 308-redirect to the area landing page. Preserves SEO value from
  // any existing inbound links.
  if (!isComboInCurrentTier(combo.area, combo.service.prefix)) {
    permanentRedirect(`/areas/${combo.area.slug}`);
  }

  const { area, service } = combo;

  // Other service variants for this same area (only ones we still generate)
  const sameAreaOthers = getCurrentServicesForArea(area)
    .filter((p) => p !== service.prefix)
    .map((p) => servicePrefixes.find((s) => s.prefix === p))
    .filter((s): s is NonNullable<typeof s> => s !== undefined)
    .slice(0, 5);

  // Same service in nearby areas (same council) â€” only ones we still generate
  const sameServiceNearby = areas
    .filter(
      (a) =>
        a.slug !== area.slug &&
        a.council === area.council &&
        isComboInCurrentTier(a, service.prefix),
    )
    .slice(0, 6);

  // Structured data â€” helps with rich snippets and local pack
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${service.searchPhrase} in ${area.name}`,
    serviceType: service.searchPhrase,
    description: `${service.searchPhrase} services in ${area.name}, ${area.council}.`,
    provider: {
      "@type": "LocalBusiness",
      name: "Envirocycle Glasgow",
      telephone: "+447450435241",
      email: "envirocycleglasgow@outlook.com",
      url: "https://envirocycleglasgow.com",
      image: "https://envirocycleglasgow.com/images/logo.png",
    },
    areaServed: {
      "@type": "Place",
      name: area.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: area.name,
        addressRegion: area.council,
        addressCountry: "GB",
        postalCode: area.postcodes.join(", "),
      },
    },
  };

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Navbar />

      {/* â”€â”€ Hero â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16 px-5 md:px-8 max-w-7xl mx-auto">
        <nav
          className="mb-6 text-xs tracking-widest uppercase"
          style={{ color: "rgba(245,240,232,0.45)" }}
        >
          <Link href="/areas" className="hover:text-[var(--gold-light)]">
            Areas
          </Link>
          {" / "}
          <Link
            href={`/areas/${area.slug}`}
            className="hover:text-[var(--gold-light)]"
          >
            {area.name}
          </Link>
          {" / "}
          <span style={{ color: "var(--gold)" }}>
            {service.searchPhrase}
          </span>
        </nav>

        <p className="section-label mb-3">
          {service.searchPhrase} Â· {area.name}
        </p>
        <h1
          className="leading-none mb-6"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2.4rem, 7vw, 4.5rem)",
            color: "var(--cream)",
            letterSpacing: "0.02em",
          }}
        >
          {service.h1Verb}{" "}
          <span className="gold-text">{area.name.toUpperCase()}</span>
        </h1>

        <p
          className="max-w-2xl text-base md:text-lg mb-5"
          style={{ color: "rgba(245,240,232,0.75)" }}
        >
          {service.intro}
        </p>
        <p
          className="max-w-2xl text-sm md:text-base mb-8"
          style={{ color: "rgba(245,240,232,0.6)" }}
        >
          {area.localHook}
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

      {/* â”€â”€ Detail â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section
        className="py-16 md:py-24 px-5 md:px-8"
        style={{ background: "rgba(26,68,29,0.15)" }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <p className="section-label mb-3">How It Works</p>
            <h2
              className="leading-none mb-6"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.8rem, 4vw, 3rem)",
                color: "var(--cream)",
              }}
            >
              {service.h1Verb} IN {area.name.toUpperCase()}
            </h2>
            <p
              className="text-base md:text-lg mb-6"
              style={{ color: "rgba(245,240,232,0.75)", lineHeight: 1.7 }}
            >
              {service.body}
            </p>
            <p
              className="text-sm md:text-base"
              style={{ color: "rgba(245,240,232,0.6)" }}
            >
              We cover all of {area.name} ({area.postcodes.join(", ")}) and
              surrounding {area.council} â€” typically on-site within{" "}
              {area.travelMinutes} minutes of dispatch. We're familiar with the
              area around {area.landmarks.slice(0, 2).join(" and ")}, including
              parking and access constraints.
            </p>
          </div>
          <div>
            <p className="section-label mb-3">What's Included</p>
            <ul className="space-y-3">
              {[
                "Free quote, no obligation",
                "Licensed & insured (SEPA WCR/R/3021188)",
                "Waste transfer note on every job",
                "Reusable items go to local charities",
                "Photos before and after on request",
                "Cash, card, or invoice payment",
              ].map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-3 text-sm md:text-base"
                  style={{ color: "rgba(245,240,232,0.75)" }}
                >
                  <span className="mt-1 text-[var(--gold)] shrink-0">âœ“</span>
                  {line}
                </li>
              ))}
            </ul>

            <div
              className="mt-8 p-5 rounded-2xl"
              style={{
                background:
                  "linear-gradient(145deg, rgba(26,68,29,0.5), rgba(10,31,11,0.7))",
                border: "1px solid rgba(212,160,23,0.2)",
              }}
            >
              <p
                className="text-xs tracking-widest uppercase mb-2"
                style={{ color: "var(--gold)" }}
              >
                Local Landmarks We Cover Near
              </p>
              <p style={{ color: "rgba(245,240,232,0.7)" }}>
                {area.landmarks.join(" Â· ")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€ Why us in this area â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="py-16 px-5 md:px-8 max-w-7xl mx-auto">
        <p className="section-label mb-3">Why Envirocycle</p>
        <h2
          className="leading-none mb-8"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            color: "var(--cream)",
          }}
        >
          {service.searchPhrase.toUpperCase()} IN{" "}
          <span className="gold-text">{area.name.toUpperCase()}</span> â€” DONE
          PROPERLY
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className="p-6 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(212,160,23,0.15)",
            }}
          >
            <p
              className="text-xs tracking-widest uppercase mb-3"
              style={{ color: "var(--gold)" }}
            >
              Local Knowledge
            </p>
            <p style={{ color: "rgba(245,240,232,0.75)" }}>
              We work {area.name} most weeks â€” we know the access roads, the
              parking, and the local council ({area.council}) rules.
            </p>
          </div>
          <div
            className="p-6 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(212,160,23,0.15)",
            }}
          >
            <p
              className="text-xs tracking-widest uppercase mb-3"
              style={{ color: "var(--gold)" }}
            >
              Fast Response
            </p>
            <p style={{ color: "rgba(245,240,232,0.75)" }}>
              {area.travelMinutes} minutes from our base. Same-day uplifts
              are usually available across {area.postcodes.join(", ")}.
            </p>
          </div>
          <div
            className="p-6 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(212,160,23,0.15)",
            }}
          >
            <p
              className="text-xs tracking-widest uppercase mb-3"
              style={{ color: "var(--gold)" }}
            >
              Fully Compliant
            </p>
            <p style={{ color: "rgba(245,240,232,0.75)" }}>
              Licensed SEPA waste carrier. Every job comes with a transfer note
              and full audit trail â€” important for trade and commercial work.
            </p>
          </div>
        </div>
      </section>

      {/* â”€â”€ Other services in same area â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {sameAreaOthers.length > 0 && (
        <section
          className="py-16 px-5 md:px-8"
          style={{ background: "rgba(26,68,29,0.15)" }}
        >
          <div className="max-w-7xl mx-auto">
            <p className="section-label mb-3">Other Services</p>
            <h2
              className="leading-none mb-8"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.8rem, 4vw, 3rem)",
                color: "var(--cream)",
              }}
            >
              MORE IN <span className="gold-text">{area.name.toUpperCase()}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sameAreaOthers.map((other) => (
                <Link
                  key={other.prefix}
                  href={`/${other.prefix}-${area.slug}`}
                  className="block rounded-2xl p-5 transition-all"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(26,68,29,0.5), rgba(10,31,11,0.7))",
                    border: "1px solid rgba(212,160,23,0.15)",
                  }}
                >
                  <h3
                    className="text-lg mb-1"
                    style={{
                      fontFamily: "var(--font-heading)",
                      letterSpacing: "0.04em",
                      color: "var(--cream)",
                    }}
                  >
                    {other.searchPhrase} in {area.name}
                  </h3>
                  <p className="text-sm" style={{ color: "rgba(245,240,232,0.55)" }}>
                    {other.intro}
                  </p>
                </Link>
              ))}
            </div>
            <div className="mt-6">
              <Link
                href={`/areas/${area.slug}`}
                className="inline-flex items-center gap-2 text-sm font-semibold"
                style={{ color: "var(--gold-light)" }}
              >
                See everything we do in {area.name} â†’
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* â”€â”€ Same service in nearby areas â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {sameServiceNearby.length > 0 && (
        <section className="py-16 px-5 md:px-8 max-w-7xl mx-auto">
          <p className="section-label mb-3">Nearby Areas</p>
          <h2
            className="leading-none mb-8"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              color: "var(--cream)",
            }}
          >
            {service.h1Verb}{" "}
            <span className="gold-text">NEARBY</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {sameServiceNearby.map((other) => (
              <Link
                key={other.slug}
                href={`/${service.prefix}-${other.slug}`}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(212,160,23,0.2)",
                  color: "var(--cream)",
                }}
              >
                {service.searchPhrase} {other.name} â†’
              </Link>
            ))}
            <Link
              href="/areas"
              className="px-4 py-2 rounded-full text-sm font-semibold"
              style={{
                background: "rgba(212,160,23,0.12)",
                border: "1px solid rgba(212,160,23,0.3)",
                color: "var(--gold-light)",
              }}
            >
              View all areas â†’
            </Link>
          </div>
        </section>
      )}

      <Contact />
      <Footer />
    </main>
  );
}

// Helper used above
function getCurrentServicesForArea(area: typeof areas[number]): string[] {
  return getAllSlugCombos()
    .filter((c) => c.area.slug === area.slug)
    .map((c) => c.service.prefix);
}
