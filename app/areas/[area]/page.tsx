import {
  areas,
  servicePrefixes,
  getCombosForArea,
} from "@/lib/areas";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";

interface PageProps {
  params: { area: string };
}

export function generateStaticParams() {
  return areas.map((a) => ({ area: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const area = areas.find((a) => a.slug === params.area);
  if (!area) return {};

  const title = `Waste Removal & Rubbish Clearance in ${area.name} | Envirocycle Glasgow`;
  const description = `Licensed waste removal, rubbish clearance, and uplift services in ${area.name} (${area.postcodes.join(", ")}). Same-day where possible. Free quotes.`;

  return {
    title,
    description,
    alternates: { canonical: `/areas/${area.slug}` },
    openGraph: {
      title,
      description,
      url: `/areas/${area.slug}`,
      siteName: "Envirocycle Glasgow",
      locale: "en_GB",
      type: "website",
    },
  };
}

export default function AreaPage({ params }: PageProps) {
  const area = areas.find((a) => a.slug === params.area);
  if (!area) notFound();

  const servicesForArea = getCombosForArea(area)
    .map((prefix) => servicePrefixes.find((s) => s.prefix === prefix))
    .filter((s): s is NonNullable<typeof s> => s !== undefined);

  // Other services not generated as combo pages â€” link to the service hub instead
  const otherServices = servicePrefixes.filter(
    (s) => !getCombosForArea(area).includes(s.prefix),
  );

  // Nearby areas (same council)
  const nearbyAreas = areas
    .filter((a) => a.council === area.council && a.slug !== area.slug)
    .slice(0, 8);

  // Structured data
  const schema = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: area.name,
    address: {
      "@type": "PostalAddress",
      addressLocality: area.name,
      addressRegion: area.council,
      addressCountry: "GB",
      postalCode: area.postcodes.join(", "),
    },
    containedInPlace: {
      "@type": "AdministrativeArea",
      name: area.council,
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
          <span style={{ color: "var(--gold)" }}>{area.name}</span>
        </nav>

        <p className="section-label mb-3">Service Area Â· {area.council}</p>
        <h1
          className="leading-none mb-6"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2.4rem, 7vw, 4.5rem)",
            color: "var(--cream)",
            letterSpacing: "0.02em",
          }}
        >
          WASTE REMOVAL{" "}
          <span className="gold-text">{area.name.toUpperCase()}</span>
        </h1>

        <p
          className="max-w-2xl text-base md:text-lg mb-8"
          style={{ color: "rgba(245,240,232,0.75)", lineHeight: 1.7 }}
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

      {/* â”€â”€ About this area â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section
        className="py-16 md:py-24 px-5 md:px-8"
        style={{ background: "rgba(26,68,29,0.15)" }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
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
              COVERING{" "}
              <span className="gold-text">{area.name.toUpperCase()}</span>
            </h2>
            <div className="space-y-4 text-base md:text-lg" style={{ color: "rgba(245,240,232,0.75)", lineHeight: 1.7 }}>
              <p>{area.localHook}</p>
              <p>
                Envirocycle is based locally and covers all of {area.name} â€”
                from {area.landmarks[0]} across to{" "}
                {area.landmarks[area.landmarks.length - 1]}. Our average
                response time here is around {area.travelMinutes} minutes from
                dispatch, so same-day uplifts are usually no problem.
              </p>
              <p>
                {area.name} sits in {area.council}, so all waste from your job
                is processed under that council's regulations and reported
                accordingly. Every collection comes with a SEPA-compliant
                waste transfer note for your records.
              </p>
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
                    Council
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
                className="text-xs tracking-widest uppercase mb-3"
                style={{ color: "var(--gold)" }}
              >
                Landmarks Nearby
              </p>
              <ul className="space-y-2">
                {area.landmarks.map((l) => (
                  <li
                    key={l}
                    className="flex items-start gap-2 text-sm"
                    style={{ color: "rgba(245,240,232,0.75)" }}
                  >
                    <span style={{ color: "var(--gold)" }}>Â·</span>
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€ Services we offer here â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="py-16 px-5 md:px-8 max-w-7xl mx-auto">
        <p className="section-label mb-3">Services in {area.name}</p>
        <h2
          className="leading-none mb-8"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            color: "var(--cream)",
          }}
        >
          WHAT WE DO IN{" "}
          <span className="gold-text">{area.name.toUpperCase()}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {servicesForArea.map((s) => (
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
                {s.searchPhrase} in {area.name}
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
                See full details â†’
              </span>
            </Link>
          ))}
        </div>

        {otherServices.length > 0 && (
          <div>
            <p
              className="text-sm mb-3"
              style={{ color: "rgba(245,240,232,0.5)" }}
            >
              Also available in {area.name} (call for a quote):
            </p>
            <div className="flex flex-wrap gap-2">
              {otherServices.map((s) => (
                <Link
                  key={s.prefix}
                  href={`/services/${s.prefix}`}
                  className="px-4 py-2 rounded-full text-sm transition-all"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(212,160,23,0.15)",
                    color: "rgba(245,240,232,0.75)",
                  }}
                >
                  {s.searchPhrase}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* â”€â”€ Nearby areas â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {nearbyAreas.length > 0 && (
        <section
          className="py-16 px-5 md:px-8"
          style={{ background: "rgba(26,68,29,0.15)" }}
        >
          <div className="max-w-7xl mx-auto">
            <p className="section-label mb-3">Nearby Areas in {area.council}</p>
            <h2
              className="leading-none mb-8"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.8rem, 4vw, 3rem)",
                color: "var(--cream)",
              }}
            >
              ALSO COVERING{" "}
              <span className="gold-text">NEARBY</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {nearbyAreas.map((other) => (
                <Link
                  key={other.slug}
                  href={`/areas/${other.slug}`}
                  className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(212,160,23,0.2)",
                    color: "var(--cream)",
                  }}
                >
                  {other.name} â†’
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
          </div>
        </section>
      )}

      <Contact />
      <Footer />
    </main>
  );
}
