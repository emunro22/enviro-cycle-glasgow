"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const packages = [
  {
    name: "Waste Management",
    icon: "🗑️",
    highlight: false,
    description: "Regular waste collection tailored to your schedule",
    features: [
      "Regular waste collection tailored to your schedule",
      "Disposal of general, commercial, and hazardous waste",
      "Compliance with environmental regulations and standards",
      "Eco-friendly solutions to minimise landfill impact",
    ],
    cta: "Enquire Now",
  },
  {
    name: "Uplifts",
    icon: "🚛",
    highlight: true,
    badge: "Most Popular",
    description: "Same-day or scheduled bulky waste removal",
    features: [
      "Same-day or scheduled bulky waste removal",
      "Handling of furniture, appliances, and garden waste",
      "Professional team equipped for heavy-duty tasks",
      "Safe and responsible disposal or donation of items",
      "Convenient, hassle-free service designed for your needs",
    ],
    cta: "Book an Uplift",
  },
  {
    name: "Recycling",
    icon: "♻️",
    highlight: false,
    description: "Segregated collection of recyclable materials",
    features: [
      "Segregated collection of recyclable materials",
      "Paper, plastic, metal and glass recycling services",
      "On-site or kerbside pick-up options available",
      "Certification of recycled waste for businesses",
      "Commitment to reducing your carbon footprint",
    ],
    cta: "Go Green",
  },
];

export default function Packages() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("in-view");
        });
      },
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll(".animate-on-scroll").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="packages"
      ref={sectionRef}
      className="py-20 md:py-32 px-5 md:px-12"
      style={{ background: "rgba(10,31,11,0.95)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-14 md:mb-20 animate-on-scroll text-center">
          <p className="section-label mb-4">Pricing</p>
          <h2
            className="leading-none mb-6"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(3rem, 8vw, 6rem)",
              color: "var(--cream)",
              letterSpacing: "0.02em",
            }}
          >
            OUR <span className="gold-text">PACKAGES</span>
          </h2>
          <p
            className="max-w-lg mx-auto text-base leading-relaxed"
            style={{ color: "rgba(245,240,232,0.6)" }}
          >
            All packages are priced competitively and tailored to your
            specific needs. Contact us for a custom quote.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {packages.map((pkg, i) => (
            <div
              key={pkg.name}
              className="animate-on-scroll relative rounded-3xl p-7 md:p-8 flex flex-col transition-all duration-500"
              style={{
                transitionDelay: `${i * 0.12}s`,
                background: pkg.highlight
                  ? "linear-gradient(145deg, rgba(212,160,23,0.12), rgba(212,160,23,0.05))"
                  : "linear-gradient(145deg, rgba(26,68,29,0.4), rgba(10,31,11,0.6))",
                border: pkg.highlight
                  ? "1.5px solid rgba(212,160,23,0.4)"
                  : "1px solid rgba(212,160,23,0.12)",
                boxShadow: pkg.highlight
                  ? "0 0 60px rgba(212,160,23,0.08)"
                  : "none",
              }}
            >
              {/* Badge */}
              {pkg.badge && (
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-xs font-bold tracking-widest whitespace-nowrap"
                  style={{
                    background: "linear-gradient(135deg, #d4a017, #f0c040)",
                    color: "#0a1f0b",
                  }}
                >
                  {pkg.badge}
                </div>
              )}

              {/* Icon & name */}
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl">{pkg.icon}</span>
                <h3
                  className="text-2xl"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: pkg.highlight ? "var(--gold-light)" : "var(--cream)",
                    letterSpacing: "0.06em",
                  }}
                >
                  {pkg.name}
                </h3>
              </div>

              <p
                className="text-sm mb-6 leading-relaxed"
                style={{ color: "rgba(245,240,232,0.6)" }}
              >
                {pkg.description}
              </p>

              {/* Divider */}
              <div
                className="w-full h-px mb-6"
                style={{ background: "rgba(212,160,23,0.12)" }}
              />

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {pkg.features.map((feat) => (
                  <li
                    key={feat}
                    className="flex items-start gap-3 text-sm leading-relaxed"
                    style={{ color: "rgba(245,240,232,0.72)" }}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={pkg.highlight ? "var(--gold)" : "var(--forest-bright)"}
                      strokeWidth="2.5"
                      className="shrink-0 mt-0.5"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href="/book"
                className="block text-center py-3.5 px-6 rounded-full font-semibold text-sm transition-all duration-300"
                style={
                  pkg.highlight
                    ? {
                        background: "linear-gradient(135deg, #d4a017, #f0c040)",
                        color: "#0a1f0b",
                        boxShadow: "0 8px 24px rgba(212,160,23,0.3)",
                      }
                    : {
                        background: "rgba(255,255,255,0.05)",
                        border: "1.5px solid rgba(245,240,232,0.15)",
                        color: "var(--cream)",
                      }
                }
                onMouseEnter={(e) => {
                  if (!pkg.highlight) {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!pkg.highlight) {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                  }
                }}
              >
                {pkg.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Custom quote note */}
        <div
          className="mt-12 text-center animate-on-scroll"
          style={{ transitionDelay: "0.4s" }}
        >
          <p className="text-sm" style={{ color: "rgba(245,240,232,0.45)" }}>
            Need something bespoke?{" "}
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="underline decoration-dotted transition-colors duration-200"
              style={{ color: "var(--gold)", opacity: 0.8 }}
            >
              Get in touch for a custom quote.
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
