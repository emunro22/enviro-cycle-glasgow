"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export const COOKIE_CONSENT_KEY = "envirocycle-cookie-consent";
export const COOKIE_CONSENT_EVENT = "cookie-consent-changed";

export type CookieConsentValue = "accepted" | "rejected";

export function getCookieConsent(): CookieConsentValue | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(COOKIE_CONSENT_KEY);
  return value === "accepted" || value === "rejected" ? value : null;
}

function setCookieConsent(value: CookieConsentValue) {
  window.localStorage.setItem(COOKIE_CONSENT_KEY, value);
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: value }));
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getCookieConsent() === null);
  }, []);

  if (!visible) return null;

  const choose = (value: CookieConsentValue) => {
    setCookieConsent(value);
    setVisible(false);
  };

  // z-index sits above the sticky contact bar (900) and the WhatsApp FAB
  // (998) so the banner and its privacy link are never covered.
  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[1200] px-5 pt-5 md:px-8"
      style={{
        background: "linear-gradient(180deg, rgba(10,31,11,0.98) 0%, #050e06 100%)",
        borderTop: "1px solid rgba(212,160,23,0.2)",
        boxShadow: "0 -8px 32px rgba(0,0,0,0.35)",
        paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom))",
      }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-4 md:gap-8">
        <p
          className="text-sm leading-relaxed flex-1"
          style={{ color: "rgba(245,240,232,0.75)" }}
        >
          We use cookies to understand how visitors use our site and improve it. We only load
          analytics cookies if you accept.{" "}
          <Link href="/privacy" className="underline" style={{ color: "var(--gold)" }}>
            Read our Privacy Policy
          </Link>
          .
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => choose("rejected")}
            className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1.5px solid rgba(245,240,232,0.15)",
              color: "var(--cream)",
            }}
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #d4a017, #f0c040)",
              color: "#0a1f0b",
            }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
