"use client";

import { useEffect, useRef, useState } from "react";

const testimonials = [
  {
    name: "Nathan McInulty",
    role: "Business Owner",
    initial: "N",
    text: "Envirocycle Glasgow made waste disposal effortless for my business. Their team is professional, efficient, and always on time. They've helped us stay on top of waste management, and we're thrilled to work with a company that prioritises sustainability as much as we do. Highly recommend their services!",
    stars: 5,
  },
  {
    name: "Aidan Craig",
    role: "Residential Client",
    initial: "A",
    text: "I couldn't be more impressed with the service from Envirocycle Glasgow. They handled everything from collection to recycling with such care, and their customer service is top-notch. I felt confident knowing my waste was being managed responsibly. It was a pleasure working with them!",
    stars: 5,
  },
  {
    name: "Liam Harper",
    role: "Facilities Manager",
    initial: "L",
    text: "Envirocycle Glasgow has been an invaluable partner for our facility. Their waste uplifts are always handled professionally and without disruption to our operations. The team is friendly, reliable, and highly skilled. It's great to have a waste management company that truly cares about making a positive impact on the environment.",
    stars: 5,
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
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

  const goTo = (i: number) => {
    if (animating || i === active) return;
    setAnimating(true);
    setTimeout(() => {
      setActive(i);
      setAnimating(false);
    }, 300);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      goTo((active + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [active]);

  const t = testimonials[active];

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-32 px-5 md:px-12"
      style={{
        background: "linear-gradient(180deg, rgba(10,31,11,0.95) 0%, rgba(26,68,29,0.1) 100%)",
      }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-14 md:mb-20 animate-on-scroll">
          <p className="section-label mb-4">Testimonials</p>
          <h2
            className="leading-none"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(3rem, 8vw, 6rem)",
              color: "var(--cream)",
              letterSpacing: "0.02em",
            }}
          >
            WHAT CLIENTS{" "}
            <span className="gold-text">SAY</span>
          </h2>
        </div>

        {/* Testimonial */}
        <div className="animate-on-scroll" style={{ transitionDelay: "0.15s" }}>
          <div
            className="rounded-3xl p-8 md:p-12 relative overflow-hidden"
            style={{
              background: "linear-gradient(145deg, rgba(26,68,29,0.4), rgba(10,31,11,0.7))",
              border: "1px solid rgba(212,160,23,0.15)",
            }}
          >
            {/* Quote mark */}
            <div
              className="absolute top-8 right-8 md:top-10 md:right-12"
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "8rem",
                lineHeight: 1,
                color: "rgba(212,160,23,0.06)",
                userSelect: "none",
              }}
            >
              "
            </div>

            {/* Stars */}
            <div className="flex gap-1 mb-6">
              {Array.from({ length: t.stars }).map((_, i) => (
                <svg
                  key={i}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="var(--gold)"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>

            {/* Quote text */}
            <p
              className="text-lg md:text-xl leading-relaxed mb-8 relative z-10 transition-all duration-300"
              style={{
                color: "rgba(245,240,232,0.85)",
                opacity: animating ? 0 : 1,
                transform: animating ? "translateY(8px)" : "translateY(0)",
              }}
            >
              "{t.text}"
            </p>

            {/* Author */}
            <div
              className="flex items-center gap-4 transition-all duration-300"
              style={{
                opacity: animating ? 0 : 1,
                transform: animating ? "translateY(8px)" : "translateY(0)",
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
                style={{
                  background: "linear-gradient(135deg, #d4a017, #f0c040)",
                  color: "#0a1f0b",
                  fontFamily: "var(--font-heading)",
                }}
              >
                {t.initial}
              </div>
              <div>
                <p className="font-semibold" style={{ color: "var(--cream)" }}>
                  {t.name}
                </p>
                <p className="text-sm" style={{ color: "rgba(212,160,23,0.7)" }}>
                  {t.role}
                </p>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: i === active ? "28px" : "8px",
                  height: "8px",
                  background:
                    i === active ? "var(--gold)" : "rgba(212,160,23,0.25)",
                }}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
