"use client";

import { useEffect, useState } from "react";
import { track } from "@vercel/analytics";

export const WHATSAPP_CLICKED_EVENT = "whatsapp-clicked";

type Status = "idle" | "submitting" | "success" | "error";

export default function WhatsAppFollowUpPrompt() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    const handler = () => {
      setVisible(true);
      setEmail("");
      setStatus("idle");
    };
    window.addEventListener(WHATSAPP_CLICKED_EVENT, handler);
    return () => window.removeEventListener(WHATSAPP_CLICKED_EVENT, handler);
  }, []);

  useEffect(() => {
    if (status !== "success") return;
    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
  }, [status]);

  if (!visible) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/whatsapp-followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) throw new Error("Request failed");
      track("WhatsApp Followup Email Captured");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="whatsapp-followup" role="dialog" aria-label="Leave your email for a follow-up">
      <button
        type="button"
        className="whatsapp-followup-close"
        aria-label="Dismiss"
        onClick={() => setVisible(false)}
      >
        ×
      </button>

      {status === "success" ? (
        <p className="whatsapp-followup-success">Thanks — we'll check in tomorrow!</p>
      ) : (
        <>
          <p className="whatsapp-followup-text">
            We've opened WhatsApp for you. Want us to check in tomorrow and ask how it went?
          </p>
          <form onSubmit={handleSubmit} className="whatsapp-followup-form">
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="whatsapp-followup-input"
              disabled={status === "submitting"}
            />
            <button
              type="submit"
              className="whatsapp-followup-submit"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "..." : "Send"}
            </button>
          </form>
          {status === "error" && (
            <p className="whatsapp-followup-error">Something went wrong — please try again.</p>
          )}
        </>
      )}
    </div>
  );
}
