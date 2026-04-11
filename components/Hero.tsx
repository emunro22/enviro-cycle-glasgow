"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const words = ["SUSTAINABLE", "EFFICIENT", "RESPONSIBLE", "ECO-FRIENDLY"];

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % words.length);
        setVisible(true);
      }, 400);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0a1f0b]">
      
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/before-pallets.jpg"
          alt="Envirocycle site clearance Glasgow"
          fill
          priority
          className="object-cover object-center"
          style={{ opacity: 0.18 }}
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(160deg,rgba(10,31,11,0.93)_0%,rgba(10,31,11,0.78)_50%,rgba(10,31,11,0.93)_100%)]" />

      {/* Accent overlays */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 60% at 50% 0%, rgba(51,134,56,0.1) 0%, transparent 70%),
            radial-gradient(ellipse 40% 30% at 80% 80%, rgba(212,160,23,0.06) 0%, transparent 60%)
          `,
        }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,160,23,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,160,23,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-8 pt-24 md:pt-32">
        
        {/* Heading */}
        <h1
          className="leading-none mb-3 md:mb-4"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2.8rem, 11vw, 6.5rem)",
            color: "var(--cream)",
            letterSpacing: "0.02em",
          }}
        >
          <span style={{ display: "block", animation: "fadeUp 0.6s ease 0.2s forwards", opacity: 0 }}>
            WASTE
          </span>
          <span className="gold-text" style={{ display: "block", animation: "fadeUp 0.6s ease 0.35s forwards", opacity: 0 }}>
            MANAGEMENT
          </span>
          <span style={{ display: "block", animation: "fadeUp 0.6s ease 0.5s forwards", opacity: 0 }}>
            GLASGOW
          </span>
        </h1>

        {/* Badge */}
        <div
              className="inline-flex items-center gap-2 mb-4 md:mb-5 px-4 py-2 rounded-full border max-w-full"
              style={{
                background: "rgba(51,134,56,0.15)",
                borderColor: "rgba(51,134,56,0.3)",
              }}
            >
              <span className="w-2 h-2 rounded-full bg-[#57a45b] shadow-[0_0_8px_#57a45b] shrink-0" />

              <span
                className="text-[0.65rem] md:text-[0.7rem] font-semibold tracking-[0.18em] text-[#8ac48d] leading-tight break-words"
              >
                GLASGOW & SURROUNDING AREAS
              </span>
            </div>        
            
        {/* Rotating word */}
        <div className="flex items-center gap-3 mb-4 md:mb-5">
          <div className="w-10 h-[1px] bg-[var(--gold)] opacity-40" />
          <span
            className="text-[0.85rem] font-semibold tracking-[0.25em]"
            style={{
              color: "var(--gold)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(8px)",
              transition: "all 0.3s",
            }}
          >
            {words[wordIndex]}
          </span>
          <span className="text-[0.85rem] tracking-[0.1em] text-[rgba(245,240,232,0.4)]">
            WASTE SOLUTIONS
          </span>
        </div>

        {/* Description */}
        <p
          className="mb-6 md:mb-8 max-w-[26rem] md:max-w-[30rem]"
          style={{
            color: "rgba(245,240,232,0.65)",
            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
            lineHeight: 1.7,
          }}
        >
          Professional waste management, uplifts and recycling services
          for residential and commercial clients across Glasgow.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center justify-center gap-3 font-semibold px-6 py-3 md:px-8 md:py-4 rounded-full"
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

        {/* Trust badges */}
        <div className="flex flex-wrap items-center gap-5 mt-8 text-sm text-[rgba(245,240,232,0.45)]">
          {["Licensed & Insured", "Same-Day Available", "Eco-Friendly"].map((b) => (
            <div key={b} className="flex items-center gap-2">
              <span className="text-[var(--gold)]">✓</span>
              {b}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}