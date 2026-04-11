"use client";

import { useEffect, useRef, useState } from "react";

const services = [
  "Waste Management",
  "Uplifts",
  "Recycling",
  "Site Clearance",
  "Other",
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("in-view");
        });
      },
      { threshold: 0.1 }
    );

    sectionRef.current
      ?.querySelectorAll(".animate-on-scroll, .animate-on-scroll-left, .animate-on-scroll-right")
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("success");
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          service: "",
          message: "",
        });
      } else {
        throw new Error("Failed");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please call us directly.");
    }
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(212,160,23,0.15)",
    borderRadius: "12px",
    padding: "12px 14px",
    color: "var(--cream)",
    fontSize: "14px",
    width: "100%",
    outline: "none",
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-16 md:py-28 px-4 md:px-10 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, rgba(26,68,29,0.1) 0%, rgba(10,31,11,1) 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">

          {/* LEFT SIDE */}
          <div className="w-full overflow-hidden">
            <div className="mb-8">
              <p className="mb-3 text-xs tracking-[0.2em] text-[rgba(212,160,23,0.6)] uppercase">
                Get In Touch
              </p>

              <h2
                className="leading-tight mb-4 break-words"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(2.4rem, 8vw, 5rem)",
                  color: "var(--cream)",
                }}
              >
                LET&apos;S GET{" "}
                <span className="gold-text">STARTED</span>
              </h2>

              <p className="text-sm md:text-base text-[rgba(245,240,232,0.65)] max-w-md">
                Ready to clear the clutter? Get in touch for a free quote.
                We usually respond within a few hours.
              </p>
            </div>

            {/* CONTACT CARDS */}
            <div className="space-y-3">
              {[
                {
                  label: "Phone",
                  value: "+44 7450 435241",
                  href: "tel:+447450435241",
                },
                {
                  label: "Email",
                  value: "envirocycleglasgow@outlook.com",
                  href: "mailto:envirocycleglasgow@outlook.com",
                },
                {
                  label: "Instagram",
                  value: "@envirocycleglasgow_ltd",
                  href: "https://www.instagram.com/envirocycleglasgow_ltd/",
                },
                {
                  label: "Location",
                  value: "Glasgow & surrounding areas",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-3 md:p-4 rounded-xl flex flex-col gap-1 break-words"
                  style={{
                    background: "rgba(26,68,29,0.25)",
                    border: "1px solid rgba(212,160,23,0.1)",
                  }}
                >
                  <span className="text-[10px] tracking-widest uppercase text-[rgba(212,160,23,0.6)]">
                    {item.label}
                  </span>

                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm text-[var(--cream)] break-all"
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="text-sm text-[var(--cream)] break-words">
                      {item.value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE (FORM) */}
          <div className="w-full">
            <div
              className="rounded-2xl p-5 md:p-8"
              style={{
                background:
                  "linear-gradient(145deg, rgba(26,68,29,0.35), rgba(10,31,11,0.7))",
                border: "1px solid rgba(212,160,23,0.15)",
              }}
            >
              {status === "success" ? (
                <div className="text-center py-10">
                  <h3 className="text-2xl text-[var(--cream)] mb-2">
                    Message Sent
                  </h3>
                  <p className="text-sm text-[rgba(245,240,232,0.6)]">
                    We’ll get back to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">

                  <h3 className="text-xl text-[var(--cream)] mb-2">
                    Send Message
                  </h3>

                  {/* NAME STACKS ON MOBILE */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      name="firstName"
                      placeholder="First name"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                    />
                    <input
                      name="lastName"
                      placeholder="Last name"
                      value={form.lastName}
                      onChange={handleChange}
                      style={inputStyle}
                    />
                  </div>

                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                  />

                  <input
                    name="phone"
                    placeholder="Phone"
                    value={form.phone}
                    onChange={handleChange}
                    style={inputStyle}
                  />

                  <select
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    <option value="">Select service</option>
                    {services.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>

                  <textarea
                    name="message"
                    placeholder="Your message..."
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    style={{ ...inputStyle, resize: "vertical" }}
                  />

                  {status === "error" && (
                    <p className="text-sm text-red-400">{errorMsg}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full py-3 rounded-full font-semibold"
                    style={{
                      background:
                        "linear-gradient(135deg, #d4a017, #f0c040)",
                      color: "#0a1f0b",
                    }}
                  >
                    {status === "loading" ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}