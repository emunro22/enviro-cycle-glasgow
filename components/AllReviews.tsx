"use client";

import { useMemo, useState } from "react";
import {
  googleReviews,
  googleReviewsUrl,
  relativeFromIso,
  type GoogleReview,
} from "@/lib/google-reviews-data";

interface LiveReview {
  name: string;
  text: string;
  stars: number;
  date: string;
  photoUrl?: string | null;
  profileUrl?: string | null;
}

interface Card {
  name: string;
  initial: string;
  meta: string;
  date: string;
  text: string;
  stars: number;
  ownerReply?: string;
  photoUrl?: string | null;
  sortKey: number;
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

/** Same author, and one text starts with the other's opening 40 characters. */
function isSameReview(
  a: { name: string; text: string },
  b: { name: string; text: string }
) {
  if (normalize(a.name) !== normalize(b.name)) return false;
  const textA = normalize(a.text);
  const textB = normalize(b.text);
  if (!textA || !textB) return false;
  const head = Math.min(40, textA.length, textB.length);
  return textA.slice(0, head) === textB.slice(0, head);
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

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width={15} height={15} viewBox="0 0 24 24" fill="var(--gold)">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function Avatar({ review }: { review: Card }) {
  const [failed, setFailed] = useState(false);
  const showPhoto = !!review.photoUrl && !failed;

  return (
    <div
      className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shrink-0 overflow-hidden"
      style={{
        background: showPhoto
          ? "rgba(212,160,23,0.15)"
          : "linear-gradient(135deg, #d4a017, #f0c040)",
        color: "#0a1f0b",
        fontFamily: "var(--font-heading)",
      }}
    >
      {showPhoto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={review.photoUrl as string}
          alt={`${review.name} on Google`}
          width={44}
          height={44}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        review.initial
      )}
    </div>
  );
}

const PAGE_SIZE = 12;

/**
 * The complete Google listing, newest first.
 *
 * Places only returns 5 reviews and picks them by relevance, so the full
 * set cannot be synced. It is kept as a curated list instead, and the few
 * reviews Places is currently serving are merged over the top: those
 * carry a live profile picture and an age computed from a real timestamp,
 * which is better data for the same review.
 */
export default function AllReviews({ live = [] }: { live?: LiveReview[] }) {
  const [shown, setShown] = useState(PAGE_SIZE);

  const reviews = useMemo<Card[]>(() => {
    const cards = googleReviews.map<Card>((r: GoogleReview) => {
      const liveMatch = live.find((l) => l.text && isSameReview(r, l));
      return {
        name: r.name,
        initial: r.initial,
        meta: r.meta,
        // The curated date is approximate, derived from Google's relative
        // label. Where Places is serving the same review, its age comes
        // from a real publish timestamp, so prefer that.
        date: liveMatch?.date ?? relativeFromIso(r.publishedAt),
        text: liveMatch?.text || r.text,
        stars: r.stars,
        ownerReply: r.ownerReply,
        photoUrl: liveMatch?.photoUrl ?? null,
        sortKey: new Date(r.publishedAt).getTime(),
      };
    });

    // Anything Places is serving that is not in the curated list at all,
    // i.e. a review left since this list was captured. Dated to now so it
    // sorts to the top, which is where a brand new review belongs.
    const unmatched = live
      .filter((l) => l.text && !googleReviews.some((r) => isSameReview(r, l)))
      .map<Card>((l) => ({
        name: l.name,
        initial: l.name.charAt(0).toUpperCase() || "G",
        meta: "Verified Google review",
        date: l.date,
        text: l.text,
        stars: l.stars,
        photoUrl: l.photoUrl ?? null,
        sortKey: Date.now(),
      }));

    return [...unmatched, ...cards].sort((a, b) => b.sortKey - a.sortKey);
  }, [live]);

  const visible = reviews.slice(0, shown);

  return (
    <section className="pb-20 md:pb-28 px-5 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map((review, i) => (
            <div
              key={`${review.name}-${i}`}
              className="rounded-2xl p-6 relative flex flex-col"
              style={{
                background:
                  "linear-gradient(145deg, rgba(26,68,29,0.35), rgba(10,31,11,0.65))",
                border: "1px solid rgba(212,160,23,0.12)",
              }}
            >
              <div className="absolute top-5 right-5">
                <GoogleLogo size={18} />
              </div>

              <div className="flex items-center gap-3 mb-3 pr-6">
                <Avatar review={review} />
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
                style={{ color: "rgba(245,240,232,0.8)" }}
              >
                {review.text}
              </p>

              {review.ownerReply && (
                <div
                  className="mt-4 pt-3 pl-3 border-l-2"
                  style={{ borderColor: "rgba(212,160,23,0.3)" }}
                >
                  <p
                    className="text-xs font-semibold mb-1"
                    style={{ color: "rgba(212,160,23,0.8)" }}
                  >
                    Envirocycle replied
                  </p>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "rgba(245,240,232,0.6)" }}
                  >
                    {review.ownerReply}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          {shown < reviews.length && (
            <button
              onClick={() => setShown((n) => n + PAGE_SIZE)}
              className="rounded-full px-8 py-3 text-sm font-semibold transition-all duration-300"
              style={{
                border: "1px solid rgba(212,160,23,0.4)",
                color: "var(--gold)",
              }}
            >
              Show more reviews ({reviews.length - shown} left)
            </button>
          )}
          <a
            href={googleReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full px-8 py-3 text-sm font-semibold transition-all duration-300 inline-flex items-center gap-2"
            style={{
              background: "var(--gold)",
              color: "#0a1f0b",
            }}
          >
            Leave a review on Google
          </a>
        </div>
      </div>
    </section>
  );
}
