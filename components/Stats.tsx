"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 500, suffix: "+", label: "Jobs Completed" },
  { value: 100, suffix: "%", label: "Licenced & Compliant" },
  { value: 24, suffix: "hr", label: "Response Time" },
  { value: 98, suffix: "%", label: "Client Satisfaction" },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 1800;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, target]);

  return (
    <div ref={ref} className="text-5xl md:text-6xl font-heading leading-none" style={{ fontFamily: "var(--font-heading)" }}>
      <span className="gold-text">{count}</span>
      <span style={{ color: "var(--gold)", opacity: 0.6 }}>{suffix}</span>
    </div>
  );
}

export default function Stats() {
  return (
    <section
      className="py-16 md:py-20 px-5 md:px-12"
      style={{
        background: "linear-gradient(180deg, rgba(26,68,29,0.2) 0%, rgba(10,31,11,0.8) 100%)",
        borderTop: "1px solid rgba(212,160,23,0.08)",
        borderBottom: "1px solid rgba(212,160,23,0.08)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <Counter target={stat.value} suffix={stat.suffix} />
              <p
                className="mt-2 text-sm font-medium tracking-wide"
                style={{ color: "rgba(245,240,232,0.55)" }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
