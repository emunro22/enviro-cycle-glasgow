"use client";

import { useEffect, useState } from "react";
import {
  googleAverageRating,
  googleReviewCount,
  googleReviewsUrl,
} from "@/lib/google-reviews-data";

export default function GoogleRatingBadge() {
  const [rating, setRating] = useState(googleAverageRating);
  const [count, setCount] = useState(googleReviewCount);

  useEffect(() => {
    fetch("/api/google-reviews")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.rating === "number") setRating(data.rating);
        if (typeof data.userRatingCount === "number") setCount(data.userRatingCount);
      })
      .catch(() => {
        // Silently keep the static fallback values above.
      });
  }, []);

  // Round down to the nearest 10 so "Over 50" only ever bumps to "Over 60"
  // once we've genuinely passed that mark.
  const roundedCount = Math.max(10, Math.floor(count / 10) * 10);

  return (
    <a
      href={googleReviewsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2"
    >
      <span className="text-[var(--gold)]">★</span>
      {rating.toFixed(1)} · Over {roundedCount} Google Reviews
    </a>
  );
}
