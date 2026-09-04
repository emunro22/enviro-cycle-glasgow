"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";

const pairs = [
  {
    label: "Site Clearance",
    subtitle: "Wood, pallets & debris removed",
    before: { src: "/images/hero-bg.webp", alt: "Pile of wood pallets and debris before clearance" },
    after:  { src: "/images/after-forecourt.webp",   alt: "Clean gravel area after clearance" },
  },
  {
    label: "Household Uplift",
    subtitle: "Broken furniture & rubbish removed",
    before: { src: "/images/before-boxes.webp", alt: "Broken IKEA furniture and cardboard before uplift" },
    after:  { src: "/images/after-gravel.webp",  alt: "Clear forecourt after uplift" },
  },
  {
    label: "Bin Area Clearance",
    subtitle: "Overflowing waste managed",
    before: { src: "/images/before-bins.webp", alt: "Overflowing bins and loose rubbish before clearance" },
    after:  { src: "/images/after-bins.webp",  alt: "Tidy organised bin area after clearance" },
  },
];

function BeforeAfterSlider({
  before,
  after,
}: {
  before: { src: string; alt: string };
  after:  { src: string; alt: string };
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => { if (dragging) updatePosition(e.clientX); },
    [dragging, updatePosition]
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", () => setDragging(false));
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", () => setDragging(false));
    };
  }, [handleMouseMove]);

  return (
    <div
      ref={containerRef}
      className="relative rounded-2xl overflow-hidden select-none"
      style={{ height: "300px", cursor: "col-resize" }}
      onMouseDown={() => setDragging(true)}
      onTouchMove={(e) => updatePosition(e.touches[0].clientX)}
    >
      {/* After. Full width base */}
      <div className="absolute inset-0">
        <Image src={after.src} alt={after.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        <div className="absolute inset-0" style={{ background: "rgba(10,31,11,0.2)" }} />
      </div>

      {/* Before, clipped */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image src={before.src} alt={before.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.15)" }} />
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 z-10"
        style={{ left: `${position}%`, background: "var(--gold)", transform: "translateX(-50%)" }}
      />

      {/* Handle button */}
      <div
        className="absolute top-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center"
        style={{
          left: `${position}%`,
          transform: "translate(-50%, -50%)",
          background: "var(--gold)",
          boxShadow: "0 0 20px rgba(212,160,23,0.6)",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0a1f0b" strokeWidth="2.5">
          <path d="M8 4l-4 4 4 4M16 4l4 4-4 4" />
        </svg>
      </div>

      {/* BEFORE label */}
      <div
        className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded-full text-xs font-bold tracking-wider"
        style={{
          background: "rgba(0,0,0,0.55)",
          border: "1px solid rgba(248,113,113,0.5)",
          color: "#f87171",
          opacity: position < 12 ? 0 : 1,
          transition: "opacity 0.2s",
        }}
      >
        BEFORE
      </div>

      {/* AFTER label */}
      <div
        className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-full text-xs font-bold tracking-wider"
        style={{
          background: "rgba(0,0,0,0.55)",
          border: "1px solid rgba(74,222,128,0.5)",
          color: "#4ade80",
          opacity: position > 88 ? 0 : 1,
          transition: "opacity 0.2s",
        }}
      >
        AFTER
      </div>
    </div>
  );
}

export default function BeforeAfter() {
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
      id="gallery"
      ref={sectionRef}
      className="py-20 md:py-32 px-5 md:px-12"
      style={{
        background: "linear-gradient(180deg, var(--forest-dark) 0%, rgba(26,68,29,0.15) 50%, var(--forest-dark) 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-14 md:mb-20 animate-on-scroll">
          <p className="section-label mb-4">Real Results</p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2
              className="leading-none"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(3rem, 8vw, 6rem)",
                color: "var(--cream)",
                letterSpacing: "0.02em",
              }}
            >
              BEFORE &{" "}
              <span className="gold-text">AFTER</span>
            </h2>
            <p className="max-w-sm text-base leading-relaxed" style={{ color: "rgba(245,240,232,0.6)" }}>
              Drag the slider to see the transformation.
              Real jobs completed by our team across Glasgow.
            </p>
          </div>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {pairs.map((pair, i) => (
            <div
              key={pair.label}
              className="animate-on-scroll"
              style={{ transitionDelay: `${i * 0.12}s` }}
            >
              <BeforeAfterSlider before={pair.before} after={pair.after} />
              <div className="mt-4 px-1">
                <h3
                  className="text-lg font-semibold"
                  style={{ fontFamily: "var(--font-heading)", color: "var(--cream)", letterSpacing: "0.06em" }}
                >
                  {pair.label}
                </h3>
                <p className="text-sm mt-1" style={{ color: "rgba(212,160,23,0.7)" }}>
                  {pair.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p
          className="text-center mt-10 text-sm animate-on-scroll"
          style={{ color: "rgba(245,240,232,0.35)", letterSpacing: "0.05em" }}
        >
          ← Drag the handle to compare before &amp; after →
        </p>
      </div>
    </section>
  );
}