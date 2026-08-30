"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export type FAQItem = { q: string; a: string };

export const homepageFaqs: FAQItem[] = [
  {
    q: "What areas of Glasgow do you cover?",
    a: "Glasgow and the surrounding areas, including South Lanarkshire, North Lanarkshire, East Dunbartonshire, West Dunbartonshire, Renfrewshire and East Renfrewshire. See our full areas list for specific towns.",
  },
  {
    q: "How quickly can you collect?",
    a: "Same-day is often available for bulky uplifts, sometimes within a couple of hours. For most other jobs we can usually offer next-day or a date of your choosing.",
  },
  {
    q: "Are you a licensed waste carrier?",
    a: "Yes — we're a SEPA-licensed waste carrier (Licence WCR/R/3021188) and fully insured, so your waste is disposed of legally and responsibly, with a transfer note for every job.",
  },
  {
    q: "Do you recycle what you collect?",
    a: "Yes. Everything we uplift is sorted and sent to licensed recycling or recovery facilities wherever possible, rather than straight to landfill.",
  },
  {
    q: "Do I need to be home for the collection?",
    a: "Not necessarily — as long as the items are accessible and we've agreed the details in advance, we can often collect without you being there. Just mention this when you book or message us on WhatsApp.",
  },
  {
    q: "How much does it cost?",
    a: "It depends on the volume and type of waste. Send a photo via WhatsApp or our booking form for a free, no-obligation quote — there's no minimum charge for small jobs.",
  },
];

export default function FAQ() {
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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: homepageFaqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="py-20 md:py-28 px-5 md:px-12"
      style={{
        background: "linear-gradient(180deg, var(--forest-dark) 0%, rgba(26,68,29,0.15) 50%, var(--forest-dark) 100%)",
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 md:mb-16 text-center animate-on-scroll">
          <p className="section-label mb-4">Questions</p>
          <h2
            className="leading-none"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              color: "var(--cream)",
              letterSpacing: "0.02em",
            }}
          >
            FREQUENTLY <span className="gold-text">ASKED</span>
          </h2>
        </div>

        <div className="space-y-4">
          {homepageFaqs.map((faq) => (
            <div key={faq.q} className="gold-card rounded-2xl p-6 animate-on-scroll">
              <h3 className="text-base font-semibold mb-2" style={{ color: "var(--cream)" }}>
                {faq.q}
              </h3>
              <p className="leading-relaxed text-sm" style={{ color: "rgba(245,240,232,0.7)" }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        <p className="text-center mt-10 text-sm animate-on-scroll" style={{ color: "rgba(245,240,232,0.5)" }}>
          Got a different question?{" "}
          <Link href="/faq" className="underline" style={{ color: "var(--gold)" }}>
            See the full FAQ
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
