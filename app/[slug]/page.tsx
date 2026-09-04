import { getAllAreas } from "@/lib/get-all-areas";
import {
  getAllSlugCombos,
  parseSlugWithAreas,
  isComboInCurrentTier,
  servicePrefixes,
  getCombosForArea,
} from "@/lib/areas";
import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import AreaViewTracker from "@/components/AreaViewTracker";
import AreaMap from "@/components/AreaMap";
import { SITE_URL } from "@/lib/site";

interface PageProps {
  params: { slug: string };
}

export const revalidate = 300;

export function generateStaticParams() {
  // Pre-render combos for static areas; DB-added area combos render on-demand
  return getAllSlugCombos().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const allAreas = await getAllAreas();
  const combo = parseSlugWithAreas(params.slug, allAreas);
  if (!combo) return {};
  if (!isComboInCurrentTier(combo.area, combo.service.prefix)) return {};

  const { area, service } = combo;
  const title = `${service.searchPhrase} in ${area.name} | Envirocycle Glasgow`;
  const description = `${service.intro} Covering ${area.name} (${area.postcodes.join(", ")}). Free quotes, same-day where possible.`;

  return {
    title,
    description,
    alternates: { canonical: `/${combo.slug}` },
    openGraph: {
      title,
      description,
      url: `/${combo.slug}`,
      siteName: "Envirocycle Glasgow",
      locale: "en_GB",
      type: "website",
    },
  };
}

export default async function SlugPage({ params }: PageProps) {
  const allAreas = await getAllAreas();
  const combo = parseSlugWithAreas(params.slug, allAreas);

  // Unknown slug entirely
  if (!combo) notFound();

  const { area, service } = combo;

  // Retired combo. 308 to the area landing page
  if (!isComboInCurrentTier(area, service.prefix)) {
    permanentRedirect(`/areas/${area.slug}`);
  }

  // Nearby services for this area (other combos in the same tier)
  const nearbyServices = getCombosForArea(area)
    .filter((p) => p !== service.prefix)
    .map((p) => servicePrefixes.find((s) => s.prefix === p))
    .filter((s): s is NonNullable<typeof s> => s !== undefined)
    .slice(0, 4);

  // Same service in nearby areas
  const nearbyAreas = allAreas
    .filter(
      (a) =>
        a.slug !== area.slug &&
        getCombosForArea(a).includes(service.prefix),
    )
    .sort((a, b) => a.travelMinutes - b.travelMinutes)
    .slice(0, 6);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${service.searchPhrase} in ${area.name}`,
    provider: {
      "@type": "LocalBusiness",
      name: "Envirocycle Glasgow",
      telephone: "+447450435241",
      url: SITE_URL,
    },
    areaServed: {
      "@type": "Place",
      name: area.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: area.name,
        addressRegion: area.council,
        postalCode: area.postcodes.join(", "),
        addressCountry: "GB",
      },
      hasMap: `https://maps.google.com/maps?q=${encodeURIComponent(`${area.name}, ${area.postcodes.join(" ")}, Glasgow, UK`)}`,
    },
    description: service.intro,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: area.name, item: `${SITE_URL}/areas/${area.slug}` },
      { "@type": "ListItem", position: 3, name: service.searchPhrase, item: `${SITE_URL}/${combo.slug}` },
    ],
  };

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <AreaViewTracker area={area.name} council={area.council} service={service.searchPhrase} />
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
          <Link href={`/areas/${area.slug}`} className="hover:text-[var(--gold-light)]">
            {area.name}
          </Link>
          {" / "}
          <span style={{ color: "var(--gold)" }}>{service.searchPhrase}</span>
        </nav>

        <p className="section-label mb-3">
          {service.searchPhrase} · {area.name}
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
          className="max-w-2xl text-base md:text-lg mb-8"
          style={{ color: "rgba(245,240,232,0.75)", lineHeight: 1.7 }}
        >
          {service.intro}
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

      {/* ── About the area ─────────────────────────────────────────────────── */}
      <section
        className="py-16 md:py-24 px-5 md:px-8"
        style={{ background: "rgba(26,68,29,0.15)" }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div>
            <p className="section-label mb-3">About {area.name}</p>
            <h2
              className="leading-none mb-6"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.8rem, 4vw, 3rem)",
                color: "var(--cream)",
              }}
            >
              LOCAL TO{" "}
              <span className="gold-text">{area.name.toUpperCase()}</span>
            </h2>
            <div
              className="space-y-4 text-base md:text-lg"
              style={{ color: "rgba(245,240,232,0.75)", lineHeight: 1.7 }}
            >
              <p>{area.localHook}</p>
              <p>{service.body}</p>
            </div>
          </div>

          <div className="space-y-4">
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
                Coverage Details
              </p>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm" style={{ color: "rgba(245,240,232,0.5)" }}>
                    Postcodes
                  </dt>
                  <dd style={{ color: "var(--cream)" }}>
                    {area.postcodes.join(", ")}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm" style={{ color: "rgba(245,240,232,0.5)" }}>
                    Council Area
                  </dt>
                  <dd style={{ color: "var(--cream)" }}>{area.council}</dd>
                </div>
                <div>
                  <dt className="text-sm" style={{ color: "rgba(245,240,232,0.5)" }}>
                    Response Time
                  </dt>
                  <dd style={{ color: "var(--cream)" }}>
                    ~{area.travelMinutes} minutes from base
                  </dd>
                </div>
                <div>
                  <dt className="text-sm" style={{ color: "rgba(245,240,232,0.5)" }}>
                    Landmarks
                  </dt>
                  <dd style={{ color: "var(--cream)" }}>
                    {area.landmarks.join(", ")}
                  </dd>
                </div>
              </dl>
            </div>

            <div
              className="p-6 rounded-2xl"
              style={{
                background:
                  "linear-gradient(145deg, rgba(26,68,29,0.5), rgba(10,31,11,0.7))",
                border: "1px solid rgba(212,160,23,0.2)",
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
                  "SEPA-licensed waste carrier",
                  "Waste transfer note on every job",
                  "Reusable items donated to local charities",
                  "Same-day uplifts where possible",
                  "Fixed pricing, no hidden charges",
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
        </div>

        <div className="max-w-7xl mx-auto mt-10">
          <p
            className="text-xs tracking-widest uppercase mb-3"
            style={{ color: "var(--gold)" }}
          >
            Where We Cover in {area.name}
          </p>
          <AreaMap
            query={`${area.name}, ${area.postcodes.join(" ")}, Glasgow, UK`}
            title={`Map of our ${area.name} coverage area`}
          />
        </div>
      </section>

      {/* ── Other services in this area ────────────────────────────────────── */}
      {nearbyServices.length > 0 && (
        <section className="py-16 px-5 md:px-8 max-w-7xl mx-auto">
          <p className="section-label mb-3">More Services in {area.name}</p>
          <h2
            className="leading-none mb-8"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              color: "var(--cream)",
            }}
          >
            OTHER SERVICES IN{" "}
            <span className="gold-text">{area.name.toUpperCase()}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {nearbyServices.map((s) => (
              <Link
                key={s.prefix}
                href={`/${s.prefix}-${area.slug}`}
                className="block rounded-2xl p-6 transition-all"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(26,68,29,0.5), rgba(10,31,11,0.7))",
                  border: "1px solid rgba(212,160,23,0.15)",
                }}
              >
                <h3
                  className="text-xl mb-2"
                  style={{
                    fontFamily: "var(--font-heading)",
                    letterSpacing: "0.04em",
                    color: "var(--cream)",
                  }}
                >
                  {s.searchPhrase}
                </h3>
                <p
                  className="text-sm mb-3"
                  style={{ color: "rgba(245,240,232,0.6)" }}
                >
                  {s.intro}
                </p>
                <span
                  className="inline-flex items-center gap-2 text-sm font-semibold"
                  style={{ color: "var(--gold-light)" }}
                >
                  View details →
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-6">
            <Link
              href={`/areas/${area.slug}`}
              className="inline-flex items-center gap-2 text-sm font-semibold"
              style={{ color: "var(--gold-light)" }}
            >
              All services in {area.name} →
            </Link>
          </div>
        </section>
      )}

      {/* ── Same service, nearby areas ──────────────────────────────────────── */}
      {nearbyAreas.length > 0 && (
        <section
          className="py-16 px-5 md:px-8"
          style={{ background: "rgba(26,68,29,0.15)" }}
        >
          <div className="max-w-7xl mx-auto">
            <p className="section-label mb-3">{service.searchPhrase} Nearby</p>
            <h2
              className="leading-none mb-8"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.8rem, 4vw, 3rem)",
                color: "var(--cream)",
              }}
            >
              ALSO COVERING{" "}
              <span className="gold-text">NEARBY AREAS</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {nearbyAreas.map((a) => (
                <Link
                  key={a.slug}
                  href={`/${service.prefix}-${a.slug}`}
                  className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(212,160,23,0.2)",
                    color: "var(--cream)",
                  }}
                >
                  {service.searchPhrase} in {a.name} →
                </Link>
              ))}
              <Link
                href={`/services/${service.prefix}`}
                className="px-4 py-2 rounded-full text-sm font-semibold"
                style={{
                  background: "rgba(212,160,23,0.12)",
                  border: "1px solid rgba(212,160,23,0.3)",
                  color: "var(--gold-light)",
                }}
              >
                View all {service.searchPhrase} areas →
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
