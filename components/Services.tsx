"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

/**
 * Every service gets a card here, and the rail scrolls sideways rather
 * than growing into a tall grid the user has to scroll past. Order matches
 * /services so the two pages tell the same story.
 */
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
      "Tailored waste management solutions for both commercial and residential clients. From regular collection to specialised disposal, we handle every waste type.",
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
    title: "Bulky Waste Uplifts",
    subtitle: "Same-Day Available",
    description:
      "Professional uplifts for large items and full loads. Our team ensures quick, hassle-free removal with minimal disruption to your day.",
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
      "Efficient waste clearance built for businesses and trades across Scotland. We collect, sort and recycle with full compliance so you stay focused on the job.",
    features: [
      "Flexible business collections",
      "Full waste transfer notes",
      "Recycling-focused handling",
      "Minimal disruption on site",
    ],
  },
  {
    slug: "/services/recycling",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M7 19H4.5a2 2 0 01-1.73-3l2.4-4.15" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9.6 7.15L12 3l2.4 4.15" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17 19h2.5a2 2 0 001.73-3L18.8 11.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 19l2-3.5H5.6M20.5 13.4L18.8 11.8l-.6 3.4M8.5 3.6L12 3l-.6 3.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Recycling Services",
    subtitle: "Landfill Diversion",
    description:
      "Segregated recycling collection for Glasgow businesses and homes. Paper, plastic, metal and glass sorted properly and diverted from landfill.",
    features: [
      "Segregated collections",
      "Paper, plastic, metal, glass",
      "Diversion reporting",
      "SEPA licensed carrier",
    ],
  },
  {
    slug: "/services/site-clearance",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 21h18M5 21V10l7-5 7 5v11" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 21v-5h6v5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Site Clearance",
    subtitle: "Whole Property",
    description:
      "Whole-property and outdoor clearances across Glasgow. House, garden and end-of-tenancy clear-outs handled quickly and responsibly.",
    features: [
      "Full property clear-outs",
      "Indoor & outdoor spaces",
      "End-of-tenancy ready",
      "Swept clean on completion",
    ],
  },
  {
    slug: "/services/waste-removal",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 16V7a1 1 0 011-1h10v10H3z" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 10h4l3 3v3h-7v-6z" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="7" cy="18" r="2"/>
        <circle cx="17" cy="18" r="2"/>
      </svg>
    ),
    title: "Waste Removal",
    subtitle: "Licensed & Insured",
    description:
      "Licensed waste removal, uplifts and recycling for domestic and commercial jobs, with same-day slots available across the city.",
    features: [
      "Same-day availability",
      "Domestic & commercial",
      "All loading included",
      "Fully insured team",
    ],
  },
  {
    slug: "/services/rubbish-removal",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 7h16l-1.2 13.1a1 1 0 01-1 .9H6.2a1 1 0 01-1-.9L4 7z" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 7V4.5A1.5 1.5 0 0110.5 3h3A1.5 1.5 0 0115 4.5V7" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Rubbish Removal",
    subtitle: "Single Items To Full Loads",
    description:
      "Quick, no-fuss rubbish removal from single items to full van loads. Cheaper and faster than hiring a skip.",
    features: [
      "Single item or full load",
      "No permit needed",
      "Priced on what you throw",
      "We do all the lifting",
    ],
  },
  {
    slug: "/services/house-clearance",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1v-9.5z" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 21v-6h6v6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "House Clearance",
    subtitle: "Discreet & Tidy",
    description:
      "Full or part house clearances for end-of-tenancy, probate and downsizing. Handled discreetly, with reusable items donated where we can.",
    features: [
      "End-of-tenancy & probate",
      "Full or partial clearance",
      "Donation where possible",
      "Sensitive, discreet team",
    ],
  },
  {
    slug: "/services/office-clearance",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 21V5a1 1 0 011-1h9a1 1 0 011 1v16M15 21V9h4a1 1 0 011 1v11" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 8h2M7 12h2M7 16h2M3 21h18" strokeLinecap="round"/>
      </svg>
    ),
    title: "Office Clearance",
    subtitle: "Out-Of-Hours Standard",
    description:
      "Commercial strip-outs, IT disposal and furniture removal. Out-of-hours bookings are standard so your business keeps running.",
    features: [
      "Evening & weekend slots",
      "Secure IT disposal",
      "Desks & office furniture",
      "Waste transfer notes issued",
    ],
  },
  {
    slug: "/services/garden-waste-removal",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 21c0-6 3-10 8-11 0 6-3 10-8 11z" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 21c0-5-2.5-8-7-9 0 5 2.5 8 7 9z" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 21v-4" strokeLinecap="round"/>
      </svg>
    ),
    title: "Garden Waste Removal",
    subtitle: "Green Waste Recycled",
    description:
      "Branches, hedge cuttings, turf, soil and old decking uplifted and recycled, with the ground left tidy behind us.",
    features: [
      "Cuttings, turf & soil",
      "Decking & fence panels",
      "Green waste recycled",
      "Access-friendly loading",
    ],
  },
  {
    slug: "/services/builders-waste-removal",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 3l7 7-3 3-7-7 3-3z" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11 6L4 13v7h7l7-7" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Builders Waste Removal",
    subtitle: "Cheaper Than A Skip",
    description:
      "Trade uplifts for renovations, kitchens, bathrooms and extensions. Rubble, plasterboard and timber cleared as the job goes.",
    features: [
      "Rubble & plasterboard",
      "Timber & packaging",
      "Repeat site collections",
      "Often cheaper than a skip",
    ],
  },
  {
    slug: "/services/furniture-disposal",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 11V8a2 2 0 012-2h12a2 2 0 012 2v3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 11h18v6H3v-6zM5 17v3M19 17v3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Furniture Disposal",
    subtitle: "Sofas, Beds & White Goods",
    description:
      "Sofas, beds, wardrobes and white goods uplifted same-day where possible, including from upper floors and tight closes.",
    features: [
      "Sofas, beds & wardrobes",
      "Fridges & white goods",
      "Stairs & tight access",
      "Dismantling included",
    ],
  },
  {
    slug: "/services/skip-hire-alternative",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 8h18l-2.5 9a1 1 0 01-1 .8H6.5a1 1 0 01-1-.8L3 8z" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 8V6a1 1 0 011-1h10a1 1 0 011 1v2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Skip Hire Alternative",
    subtitle: "No Permit, No Waiting",
    description:
      "Pay for what you actually throw out. We turn up, load it and go, with no permit to arrange and no skip sitting on your drive for a week.",
    features: [
      "No council permit",
      "No driveway taken up",
      "Pay for the space you use",
      "Loaded and gone same visit",
    ],
  },
];

const CARD_GAP = 24;

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

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

    const elements = sectionRef.current?.querySelectorAll(
      ".animate-on-scroll, .animate-on-scroll-left, .animate-on-scroll-right"
    );
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Arrow state and the position dots both read the rail's own scroll
  // offset, so a swipe on a phone and an arrow click on desktop stay in
  // agreement about where in the list the user actually is.
  const syncScrollState = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const maxScroll = rail.scrollWidth - rail.clientWidth;
    setCanScrollLeft(rail.scrollLeft > 8);
    setCanScrollRight(rail.scrollLeft < maxScroll - 8);

    const card = rail.firstElementChild as HTMLElement | null;
    if (card) {
      const step = card.offsetWidth + CARD_GAP;
      setActiveIndex(
        Math.max(0, Math.min(services.length - 1, Math.round(rail.scrollLeft / step)))
      );
    }
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    syncScrollState();
    rail.addEventListener("scroll", syncScrollState, { passive: true });
    window.addEventListener("resize", syncScrollState);
    return () => {
      rail.removeEventListener("scroll", syncScrollState);
      window.removeEventListener("resize", syncScrollState);
    };
  }, [syncScrollState]);

  function stepWidth() {
    const rail = railRef.current;
    if (!rail) return 0;
    const card = rail.firstElementChild as HTMLElement | null;
    return card ? card.offsetWidth + CARD_GAP : rail.clientWidth * 0.8;
  }

  function scrollByCard(direction: 1 | -1) {
    railRef.current?.scrollBy({ left: stepWidth() * direction, behavior: "smooth" });
  }

  function scrollToIndex(index: number) {
    railRef.current?.scrollTo({ left: stepWidth() * index, behavior: "smooth" });
  }

  const arrowStyle = (enabled: boolean) => ({
    background: enabled ? "rgba(212,160,23,0.12)" : "rgba(212,160,23,0.04)",
    border: `1px solid rgba(212,160,23,${enabled ? 0.35 : 0.12})`,
    color: enabled ? "var(--gold)" : "rgba(212,160,23,0.25)",
    cursor: enabled ? "pointer" : "default",
  });

  return (
    <section
      id="services"
      ref={sectionRef}
      /* TIGHTENED SPACING: Reduced pt-20 to pt-10 and md:pt-32 to md:pt-16 */
      className="pt-10 pb-20 md:pt-16 md:pb-32"
      style={{ background: "var(--forest-dark)" }}
    >
      {/* Horizontal padding lives on the children, not here: the rail has to
          run edge to edge so cards can bleed off the screen rather than
          stopping short at a gutter. */}
      <div className="max-w-7xl mx-auto">
        {/* Header - Reduced mb-14 to mb-8 */}
        <div className="mb-8 md:mb-12 animate-on-scroll px-5 md:px-12">
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

        {/* Rail controls. Desktop only: on a phone the swipe is the gesture,
            and the dots below carry the "there is more" cue. */}
        <div className="hidden md:flex items-center justify-between gap-4 mb-6 px-5 md:px-12">
          <p className="text-sm" style={{ color: "rgba(245,240,232,0.45)" }}>
            Scroll or use the arrows to see all {services.length} services
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              disabled={!canScrollLeft}
              aria-label="Previous service"
              className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200"
              style={arrowStyle(canScrollLeft)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              disabled={!canScrollRight}
              aria-label="Next service"
              className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200"
              style={arrowStyle(canScrollRight)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Service cards.
            Deliberately NOT .animate-on-scroll: a card parked off the right
            edge of the rail never intersects the viewport, so a scroll
            reveal would leave it stuck at opacity 0 forever. */}
        <div
          ref={railRef}
          className="services-rail flex items-stretch gap-6 overflow-x-auto snap-x snap-mandatory pt-2 pb-4 px-5 md:px-12"
        >
          {services.map((service, i) => (
            <div
              key={service.title}
              className="group relative snap-start shrink-0 rounded-3xl p-7 md:p-8 transition-all duration-500 cursor-default w-[82vw] sm:w-[360px] md:w-[380px]"
              style={{
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
                className="absolute top-8 right-8 font-heading leading-none"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "rgba(212,160,23,0.06)",
                  fontSize: "4rem",
                }}
              >
                {String(i + 1).padStart(2, "0")}
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

              {/* CTA. Now links to the dedicated service page */}
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

        {/* Position dots. On a phone these are the only cue that the rail
            keeps going, since the arrows are desktop only. */}
        <div className="flex flex-wrap justify-center gap-2 mt-6 px-5">
          {services.map((service, i) => (
            <button
              key={service.slug}
              type="button"
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to ${service.title}`}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === activeIndex ? "1.75rem" : "0.375rem",
                background: i === activeIndex ? "var(--gold)" : "rgba(212,160,23,0.25)",
              }}
            />
          ))}
        </div>

        <div className="mt-8 text-center px-5">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-200"
            style={{ color: "var(--gold-light)" }}
          >
            View all services
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
