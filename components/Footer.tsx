"use client";

import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "#services", label: "Services" },
  { href: "/services", label: "All Services" },
  { href: "#packages", label: "Packages" },
  { href: "#gallery", label: "Gallery" },
  { href: "/areas", label: "Areas We Cover" },
  { href: "/blog", label: "Blog" },
  { href: "#contact", label: "Contact" },
  { href: "/terms", label: "Terms & Conditions" },
];

export default function Footer() {
  const handleNavClick = (href: string) => {
    if (href.startsWith("#")) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer
      style={{
        background: "linear-gradient(180deg, rgba(10,31,11,0.98) 0%, #050e06 100%)",
        borderTop: "1px solid rgba(212,160,23,0.1)",
      }}
    >
      {/* CTA Banner */}
      <div
        className="py-14 md:py-20 px-5 md:px-12 text-center"
        style={{
          background: "linear-gradient(135deg, rgba(26,68,29,0.3) 0%, rgba(212,160,23,0.06) 50%, rgba(26,68,29,0.3) 100%)",
          borderBottom: "1px solid rgba(212,160,23,0.08)",
        }}
      >
        <p className="section-label mb-4">Ready to get started?</p>
        <h2
          className="leading-none mb-6"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2.5rem, 7vw, 5rem)",
            color: "var(--cream)",
            letterSpacing: "0.02em",
          }}
        >
          CLEAR YOUR SPACE{" "}
          <span className="gold-text">TODAY</span>
        </h2>
        <p
          className="max-w-md mx-auto mb-10 text-base leading-relaxed"
          style={{ color: "rgba(245,240,232,0.6)" }}
        >
          Whether it&apos;s a single uplift or ongoing waste management,
          we&apos;ve got you covered across Glasgow.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/book"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-base transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #d4a017, #f0c040)",
              color: "#0a1f0b",
              boxShadow: "0 8px 32px rgba(212,160,23,0.3)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 14px 40px rgba(212,160,23,0.45)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(212,160,23,0.3)";
            }}
          >
            Book Now
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <a
            href="tel:+447450435241"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-base transition-all duration-300"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1.5px solid rgba(245,240,232,0.15)",
              color: "var(--cream)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
            </svg>
            +44 7450 435241
          </a>
        </div>
      </div>

      {/* Main footer */}
      <div className="py-14 px-5 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 mb-12">
            {/* Brand col */}
            <div>
                            <Image
                src="/images/logo.png"
                alt="Envirocycle logo"
                width={60}
                height={60}
              />
              <div>   
                <span
                  className="text-xl tracking-widest"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--cream)",
                    letterSpacing: "0.12em",
                  }}
                >
                  ENVIROCYCLE
                </span>
              </div>
              <p
                className="text-sm leading-relaxed mb-6"
                style={{ color: "rgba(245,240,232,0.5)" }}
              >
                Efficient waste solutions and a sustainable future for
                Glasgow and surrounding areas. Founded by Christopher and
                Liam — passionate about making Glasgow cleaner and greener.
              </p>
              <a
                href="https://www.instagram.com/envirocycleglasgow_ltd/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300"
                style={{
                  background: "rgba(212,160,23,0.08)",
                  border: "1px solid rgba(212,160,23,0.2)",
                  color: "var(--gold)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(212,160,23,0.15)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(212,160,23,0.08)";
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                @envirocycleglasgow_ltd
              </a>
            </div>

            {/* Nav links */}
            <div>
              <h4
                className="text-sm font-semibold tracking-widest uppercase mb-6"
                style={{ color: "var(--gold)", opacity: 0.8 }}
              >
                Navigation
              </h4>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => handleNavClick(link.href)}
                      className="text-sm transition-colors duration-200"
                      style={{ color: "rgba(245,240,232,0.55)" }}
                      onMouseEnter={(e) =>
                        ((e.target as HTMLElement).style.color = "var(--cream)")
                      }
                      onMouseLeave={(e) =>
                        ((e.target as HTMLElement).style.color = "rgba(245,240,232,0.55)")
                      }
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4
                className="text-sm font-semibold tracking-widest uppercase mb-6"
                style={{ color: "var(--gold)", opacity: 0.8 }}
              >
                Contact
              </h4>
              <ul className="space-y-4">
                {[
                  {
                    icon: (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
                      </svg>
                    ),
                    text: "+44 7450 435241",
                    href: "tel:+447450435241",
                  },
                  {
                    icon: (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <path d="M22 6l-10 7L2 6" />
                      </svg>
                    ),
                    text: "envirocycleglasgow@outlook.com",
                    href: "mailto:envirocycleglasgow@outlook.com",
                  },
                  {
                    icon: (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                        <circle cx="12" cy="9" r="2.5" />
                      </svg>
                    ),
                    text: "Glasgow & surrounding areas",
                    href: null,
                  },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="mt-0.5 shrink-0"
                      style={{ color: "var(--gold)", opacity: 0.7 }}
                    >
                      {item.icon}
                    </span>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-sm leading-relaxed transition-colors duration-200"
                        style={{ color: "rgba(245,240,232,0.55)" }}
                        onMouseEnter={(e) =>
                          ((e.target as HTMLElement).style.color = "var(--cream)")
                        }
                        onMouseLeave={(e) =>
                          ((e.target as HTMLElement).style.color = "rgba(245,240,232,0.55)")
                        }
                      >
                        {item.text}
                      </a>
                    ) : (
                      <span
                        className="text-sm leading-relaxed"
                        style={{ color: "rgba(245,240,232,0.55)" }}
                      >
                        {item.text}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
            style={{ borderTop: "1px solid rgba(212,160,23,0.08)" }}
          >
            <p className="text-xs" style={{ color: "rgba(245,240,232,0.3)" }}>
              © {new Date().getFullYear()} Envirocycle Glasgow. All rights reserved.
            </p>
            <p className="text-xs" style={{ color: "rgba(245,240,232,0.25)" }}>
              Waste Management · Uplifts · Recycling
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
