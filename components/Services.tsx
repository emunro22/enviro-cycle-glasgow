"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const services = [
  {
    slug: "/services/waste-management",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 11v6M14 11v6" strokeLinecap="round"/>
      </svg>
    ),
    title: "Waste Management",
    subtitle: "Commercial & Residential",
    description:
      "Tailored waste management solutions for both commercial and residential clients. From regular waste collection to specialised disposal, we ensure efficient handling of all waste types.",
    features: [
      "Regular scheduled collection",
      "Commercial & hazardous waste",
      "Environmental compliance",
      "Eco-friendly disposal",
    ],
  },
  {
    slug: "/services/bulky-waste-uplifts",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M5 8l7-5 7 5v11a1 1 0 01-1 1H6a1 1 0 01-1-1V8z" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 21V12h6v9" strokeLinecap="round"/>
        <path d="M12 3v4M8 7l-3 1M16 7l3 1" strokeLinecap="round"/>
      </svg>
    ),
    title: "Uplifts",
    subtitle: "Same-Day Available",
    description:
      "Professional uplift services for large-scale waste removal, including bulky items and site clearances. Our team ensures quick, hassle-free removal with minimal disruption.",
    features: [
      "Same-day or scheduled removal",
      "Furniture & appliances",
      "Garden & construction waste",
      "Heavy-duty capable",
    ],
  },
  {
    slug: "/services/trade-waste-clearance",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L8 8H4l4 4-2 6 6-3 6 3-2-6 4-4h-4L12 2z" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="12" r="2" strokeWidth="1.5"/>
      </svg>
    ),
    title: "Trade Waste Clearance",
    subtitle: "Reliable & Fully Compliant",
    description:
      "Efficient and responsible waste clearance tailored for businesses and trades across Scotland. We handle collection, sorting, and recycling with full compliance, helping you stay focused on the job while we take care of the waste.",
    features: [
      "Flexible collections for businesses & trades",
      "Full waste transfer notes & compliance",
      "Recycling-focused waste management",
      "Fast, reliable service with minimal disruption",
    ],
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll(".animate-on-scroll, .animate-on-scroll-left, .animate-on-scroll-right");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      /* TIGHTENED SPACING: Reduced pt-20 to pt-10 and md:pt-32 to md:pt-16 */
      className="pt-10 pb-20 md:pt-16 md:pb-32 px-5 md:px-12"
      style={{ background: "var(--forest-dark)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header - Reduced mb-14 to mb-8 */}
        <div className="mb-8 md:mb-16 animate-on-scroll">
          <p className="section-label mb-3">What We Do</p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2
              className="leading-none"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(3rem, 8vw, 6rem)",
                color: "var(--cream)",
                letterSpacing: "0.02em",
              }}
            >
              OUR{" "}
              <span className="gold-text">SERVICES</span>
            </h2>
            <p
              className="max-w-sm text-base leading-relaxed"
              style={{ color: "rgba(245,240,232,0.6)" }}
            >
              Comprehensive waste solutions tailored for Glasgow
              businesses and homeowners.
            </p>
          </div>
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, i) => (
            <div
              key={service.title}
              className="animate-on-scroll group relative rounded-3xl p-7 md:p-8 transition-all duration-500 cursor-default"
              style={{
                transitionDelay: `${i * 0.12}s`,
                background: "linear-gradient(145deg, rgba(26,68,29,0.5), rgba(10,31,11,0.7))",
                border: "1px solid rgba(212,160,23,0.12)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,160,23,0.35)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 60px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,160,23,0.12)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                style={{
                  background: "rgba(212,160,23,0.12)",
                  color: "var(--gold)",
                  border: "1px solid rgba(212,160,23,0.2)",
                }}
              >
                {service.icon}
              </div>

              {/* Number */}
              <div
                className="absolute top-8 right-8 text-5xl font-heading leading-none"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "rgba(212,160,23,0.06)",
                  fontSize: "4rem",
                }}
              >
                0{i + 1}
              </div>

              <p
                className="text-xs font-semibold tracking-widest mb-2"
                style={{ color: "var(--gold)", opacity: 0.7 }}
              >
                {service.subtitle}
              </p>
              {/* Title links to the dedicated service page (internal linking for SEO) */}
              <h3
                className="text-2xl mb-4"
                style={{
                  fontFamily: "var(--font-heading)",
                  letterSpacing: "0.06em",
                  fontSize: "1.7rem",
                }}
              >
                <Link
                  href={service.slug}
                  className="transition-colors duration-200"
                  style={{ color: "var(--cream)" }}
                >
                  {service.title}
                </Link>
              </h3>
              <p
                className="text-sm leading-relaxed mb-6"
                style={{ color: "rgba(245,240,232,0.6)" }}
              >
                {service.description}
              </p>

              {/* Features */}
              <ul className="space-y-2 mb-8">
                {service.features.map((feat) => (
                  <li
                    key={feat}
                    className="flex items-center gap-3 text-sm"
                    style={{ color: "rgba(245,240,232,0.75)" }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--gold)"
                      strokeWidth="2.5"
                      className="shrink-0"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>

              {/* CTA — now links to the dedicated service page */}
              <Link
                href={service.slug}
                className="inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-200"
                style={{ color: "var(--gold)" }}
              >
                Learn More
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}