import { areas, servicePrefixes } from "@/lib/areas";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: "Areas We Cover | Envirocycle Glasgow",
  description:
    "Waste removal, rubbish uplifts and recycling across Glasgow, Lanarkshire and surrounding areas. Browse every area we serve.",
  alternates: { canonical: "/areas" },
};

export default function AreasIndex() {
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
      <section className="pt-32 pb-12 md:pt-40 md:pb-16 px-5 md:px-8 max-w-7xl mx-auto">
        <p className="section-label mb-3">Coverage</p>
        <h1
          className="leading-none mb-6"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2.6rem, 8vw, 5rem)",
            color: "var(--cream)",
            letterSpacing: "0.02em",
          }}
        >
          AREAS WE <span className="gold-text">COVER</span>
        </h1>
        <p
          className="max-w-2xl text-base md:text-lg mb-8"
          style={{ color: "rgba(245,240,232,0.7)" }}
        >
          Licensed waste removal and recycling across Glasgow, Lanarkshire, and
          surrounding councils. Tap any area below for service detail, pricing,
          and how we work locally.
        </p>
      </section>

      <section className="pb-24 px-5 md:px-8 max-w-7xl mx-auto">
        {councilOrder
          .filter((c) => byCouncil[c])
          .map((council) => (
            <div key={council} className="mb-12">
              <h2
                className="text-2xl md:text-3xl mb-5"
                style={{
                  fontFamily: "var(--font-heading)",
                  letterSpacing: "0.04em",
                  color: "var(--cream)",
                }}
              >
                {council}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {byCouncil[council].map((area) => (
                  <Link
                    key={area.slug}
                    href={`/waste-removal-${area.slug}`}
                    className="block rounded-xl p-4 transition-all"
                    style={{
                      background:
                        "linear-gradient(145deg, rgba(26,68,29,0.5), rgba(10,31,11,0.7))",
                      border: "1px solid rgba(212,160,23,0.15)",
                    }}
                  >
                    <span
                      className="block text-sm font-semibold"
                      style={{ color: "var(--cream)" }}
                    >
                      {area.name}
                    </span>
                    <span
                      className="block text-xs mt-0.5"
                      style={{ color: "rgba(245,240,232,0.5)" }}
                    >
                      {area.postcodes.join(", ")} · {area.travelMinutes} min
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
      </section>

      <Contact />
      <Footer />
    </main>
  );
}
