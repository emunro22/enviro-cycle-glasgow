"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  googleReviews,
  googleReviewsUrl,
  googleAverageRating,
  googleReviewCount,
  type GoogleReview,
} from "@/lib/google-reviews-data";

interface LiveReview {
  name: string;
  text: string;
  stars: number;
  date: string;
}

function dedupeKey(name: string, text: string) {
  return `${name.trim().toLowerCase()}|${text.trim().slice(0, 40).toLowerCase()}`;
}

function GoogleLogo({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  );
}

function Stars({ count, size = 16 }: { count: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="var(--gold)">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

const INITIAL_COUNT = 9;

export default function GoogleReviews() {
  const [expanded, setExpanded] = useState(false);
  const [liveRating, setLiveRating] = useState<number | null>(null);
  const [liveCount, setLiveCount] = useState<number | null>(null);
  const [liveReviews, setLiveReviews] = useState<LiveReview[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch("/api/google-reviews")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.rating === "number") setLiveRating(data.rating);
        if (typeof data.userRatingCount === "number") setLiveCount(data.userRatingCount);
        if (Array.isArray(data.reviews)) setLiveReviews(data.reviews);
      })
      .catch(() => {
        // Silently keep the static fallback values below.
      });
  }, []);

  const displayRating = liveRating ?? googleAverageRating;
  const displayCount = liveCount ?? googleReviewCount;

  // Merge in any freshly-synced Google reviews that aren't already in the
  // curated list, newest first, so genuinely new reviews surface automatically.
  const mergedReviews = useMemo<GoogleReview[]>(() => {
    const existingKeys = new Set(
      googleReviews.map((r) => dedupeKey(r.name, r.text))
    );
    const fresh = liveReviews
      .filter((r) => r.text && !existingKeys.has(dedupeKey(r.name, r.text)))
      .map<GoogleReview>((r) => ({
        name: r.name,
        initial: r.name.charAt(0).toUpperCase() || "G",
        meta: "Verified Google review",
        date: r.date,
        text: r.text,
        stars: r.stars,
      }));
    return [...fresh, ...googleReviews];
  }, [liveReviews]);

  const visibleReviews = expanded ? mergedReviews : mergedReviews.slice(0, INITIAL_COUNT);

  // Re-observe whenever the rendered card set actually changes (new live
  // reviews merged in, or the "show all" toggle reveals more cards):
  // a fresh review shifting into an already-visible slot mounts a brand
  // new DOM node that a mount-only observer would never see.
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
  }, [mergedReviews, expanded]);

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-28 px-5 md:px-12"
      style={{
        background: "linear-gradient(180deg, rgba(10,31,11,0.9) 0%, rgba(10,31,11,1) 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 md:mb-16 animate-on-scroll flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="section-label mb-4">Reviews</p>
            <h2
              className="leading-none"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                color: "var(--cream)",
                letterSpacing: "0.02em",
              }}
            >
              RATED ON <span className="gold-text">GOOGLE</span>
            </h2>
          </div>

          <a
            href={googleReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-2xl px-6 py-4 shrink-0 transition-transform hover:scale-[1.02]"
            style={{
              background: "linear-gradient(145deg, rgba(26,68,29,0.4), rgba(10,31,11,0.7))",
              border: "1px solid rgba(212,160,23,0.15)",
            }}
          >
            <GoogleLogo size={32} />
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="text-2xl font-bold"
                  style={{ color: "var(--cream)", fontFamily: "var(--font-heading)" }}
                >
                  {displayRating.toFixed(1)}
                </span>
                <Stars count={5} size={14} />
              </div>
              <p className="text-sm" style={{ color: "rgba(245,240,232,0.6)" }}>
                {displayCount} Google reviews · View all
              </p>
            </div>
          </a>
        </div>

        {/* Review grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleReviews.map((review, i) => (
            <div
              key={`${review.name}-${i}`}
              className="animate-on-scroll rounded-2xl p-6 relative flex flex-col"
              style={{
                background: "linear-gradient(145deg, rgba(26,68,29,0.35), rgba(10,31,11,0.65))",
                border: "1px solid rgba(212,160,23,0.12)",
                transitionDelay: `${(i % INITIAL_COUNT) * 0.05}s`,
              }}
            >
              <div className="absolute top-5 right-5">
                <GoogleLogo size={18} />
              </div>

              <div className="flex items-center gap-3 mb-3 pr-6">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #d4a017, #f0c040)",
                    color: "#0a1f0b",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {review.initial}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold truncate" style={{ color: "var(--cream)" }}>
                    {review.name}
                  </p>
                  <p className="text-xs truncate" style={{ color: "rgba(212,160,23,0.7)" }}>
                    {review.meta}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <Stars count={review.stars} />
                <span className="text-xs" style={{ color: "rgba(245,240,232,0.4)" }}>
                  {review.date}
                </span>
              </div>

              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "rgba(245,240,232,0.8)",
                  display: "-webkit-box",
                  WebkitLineClamp: 6,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {review.text}
              </p>
            </div>
          ))}
        </div>

        {mergedReviews.length > INITIAL_COUNT && (
          <div className="mt-10 flex justify-center animate-on-scroll">
            <button
              onClick={() => setExpanded((v) => !v)}
              className="rounded-full px-8 py-3 text-sm font-semibold transition-all duration-300"
              style={{
                border: "1px solid rgba(212,160,23,0.4)",
                color: "var(--gold)",
              }}
            >
              {expanded ? "Show fewer reviews" : `Show all ${mergedReviews.length} reviews`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
