import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "All Services | Envirocycle Glasgow",
  description:
    "Every waste removal, uplift and recycling service Envirocycle Glasgow offers. Browse the full list and find the right one for your job.",
  alternates: { canonical: "/services" },
};

const allServices = [
  {
    slug: "waste-management",
    name: "Waste Management",
    description:
      "Dependable waste management for Glasgow homes and businesses: scheduled collections, fully compliant disposal and a recycling-first approach.",
  },
  {
    slug: "bulky-waste-uplifts",
    name: "Bulky Waste Uplifts",
    description:
      "Furniture, appliances, white goods and garden waste removed across Glasgow: often same-day, always responsibly disposed of or donated.",
  },
  {
    slug: "trade-waste-clearance",
    name: "Trade Waste Clearance",
    description:
      "Flexible, fully compliant trade waste clearance for businesses and trades across Glasgow and Scotland.",
  },
  {
    slug: "recycling",
    name: "Recycling Services",
    description:
      "Segregated recycling collection for Glasgow businesses and homes: paper, plastic, metal and glass diverted from landfill.",
  },
  {
    slug: "site-clearance",
    name: "Site Clearance",
    description:
      "Whole-property and outdoor clearances across Glasgow: house, garden and end-of-tenancy clear-outs, handled quickly and responsibly.",
  },
  {
    slug: "waste-removal",
    name: "Waste Removal",
    description:
      "Licensed waste removal, uplifts and recycling for domestic and commercial jobs, same-day available.",
  },
  {
    slug: "rubbish-removal",
    name: "Rubbish Removal",
    description:
      "Quick, no-fuss rubbish removal. Single items to full van loads. Cheaper and faster than a skip.",
  },
  {
    slug: "house-clearance",
    name: "House Clearance",
    description:
      "Full or part house clearances: end-of-tenancy, probate, downsizing. Discreet and tidy.",
  },
  {
    slug: "office-clearance",
    name: "Office Clearance",
    description:
      "Commercial office strip-outs, IT disposal, furniture removal. Out-of-hours bookings standard.",
  },
  {
    slug: "garden-waste-removal",
    name: "Garden Waste Removal",
    description:
      "Branches, hedge cuttings, turf, soil and decking, uplifted and recycled.",
  },
  {
    slug: "builders-waste-removal",
    name: "Builders Waste Removal",
    description:
      "Trade waste uplifts for renovations, kitchens, bathrooms, extensions. Often cheaper than a skip.",
  },
  {
    slug: "furniture-disposal",
    name: "Furniture Disposal",
    description:
      "Sofas, beds, wardrobes and white goods, uplifted same-day where possible.",
  },
  {
    slug: "skip-hire-alternative",
    name: "Skip Hire Alternative",
    description:
      "Pay for what you actually throw out. We uplift and go. No permit, no floor space wasted.",
  },
];

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: allServices.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: s.name,
    url: `${SITE_URL}/services/${s.slug}`,
  })),
};

export default function ServicesIndex() {
  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <Navbar />

      <section className="pt-32 pb-12 md:pt-40 md:pb-16 px-5 md:px-8 max-w-7xl mx-auto">
        <nav
          className="mb-6 text-xs tracking-widest uppercase"
          style={{ color: "rgba(245,240,232,0.45)" }}
        >
          <Link href="/" className="hover:text-[var(--gold-light)]">
            Home
          </Link>
          {" / "}
          <span style={{ color: "var(--gold)" }}>Services</span>
        </nav>

        <p className="section-label mb-3">What We Do</p>
        <h1
          className="leading-none mb-6"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2.6rem, 8vw, 5rem)",
            color: "var(--cream)",
            letterSpacing: "0.02em",
          }}
        >
          ALL <span className="gold-text">SERVICES</span>
        </h1>
        <p
          className="max-w-2xl text-base md:text-lg mb-8"
          style={{ color: "rgba(245,240,232,0.7)" }}
        >
          Every waste removal, uplift and recycling service we offer across
          Glasgow and surrounding areas. Tap any service below for full
          details, pricing, and FAQs.
        </p>
      </section>

      <section className="pb-24 px-5 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allServices.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="block rounded-2xl p-6 transition-all"
              style={{
                background:
                  "linear-gradient(145deg, rgba(26,68,29,0.5), rgba(10,31,11,0.7))",
                border: "1px solid rgba(212,160,23,0.15)",
              }}
            >
              <h2
                className="text-xl mb-2"
                style={{
                  fontFamily: "var(--font-heading)",
                  letterSpacing: "0.04em",
                  color: "var(--cream)",
                }}
              >
                {s.name}
              </h2>
              <p
                className="text-sm mb-3"
                style={{ color: "rgba(245,240,232,0.6)" }}
              >
                {s.description}
              </p>
              <span
                className="inline-flex items-center gap-2 text-sm font-semibold"
                style={{ color: "var(--gold-light)" }}
              >
                See full details →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <Contact />
      <Footer />
    </main>
  );
}
