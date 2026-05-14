"use client";

import { useEffect } from "react";

/**
 * Global scroll-animation observer.
 * Extracted out of page.tsx so the page itself can be a Server Component
 * (required for proper per-page SEO metadata).
 * Watches any element with .animate-on-scroll / -left / -right and adds
 * the .in-view class when it enters the viewport.
 */
export default function ScrollAnimations() {
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

    const elements = document.querySelectorAll(
      ".animate-on-scroll, .animate-on-scroll-left, .animate-on-scroll-right"
    );
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}