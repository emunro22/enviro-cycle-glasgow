"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "#services", label: "Services" },
  { href: "#packages", label: "Packages" },
  { href: "#gallery", label: "Gallery" },
  { href: "#contact", label: "Contact" },
  { href: "/terms", label: "T&Cs" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    if (href.startsWith("#")) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          height: 64,
          background: scrolled ? "rgba(10,31,11,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(212,160,23,0.15)" : "none",
        }}
      >
        <div className="h-full max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-[44px] h-[44px] md:w-[56px] md:h-[56px]">
              <Image
                src="/images/logo.png"
                alt="Envirocycle"
                fill
                className="object-contain"
                priority
              />
            </div>

            <span
              className="hidden sm:block"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--cream)",
                letterSpacing: "0.12em",
                fontSize: "1.1rem",
              }}
            >
              ENVIROCYCLE
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-[rgba(245,240,232,0.7)] hover:text-[var(--gold-light)] transition"
              >
                {link.label}
              </Link>
            ))}

            <a
              href="https://www.instagram.com/envirocycleglasgow_ltd/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full border text-sm"
              style={{
                borderColor: "rgba(212,160,23,0.3)",
                color: "var(--gold-light)",
                background: "rgba(212,160,23,0.1)",
              }}
            >
              Instagram
            </a>
          </div>

          {/* HAMBURGER */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
            aria-label="Toggle menu"
          >
            <span
              className="block w-6 h-0.5 bg-[var(--gold)] transition-all duration-300"
              style={{
                transform: menuOpen ? "rotate(45deg) translate(4px, 4px)" : "none",
              }}
            />
            <span
              className="block w-6 h-0.5 bg-[var(--gold)] transition-all duration-300"
              style={{
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block w-6 h-0.5 bg-[var(--gold)] transition-all duration-300"
              style={{
                transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none",
              }}
            />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div
        className="fixed inset-0 z-40 md:hidden transition-all duration-500"
        style={{
          background: "rgba(10,31,11,0.98)",
          backdropFilter: "blur(20px)",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "all" : "none",
        }}
      >
        <div className="flex flex-col justify-center items-center h-full px-6 text-center">

          {/* LOGO */}
          <div className="flex items-center gap-3 mb-12">
            <div className="relative w-[52px] h-[52px]">
              <Image
                src="/images/logo.png"
                alt="Envirocycle"
                fill
                className="object-contain"
              />
            </div>
            <span
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--cream)",
                letterSpacing: "0.1em",
                fontSize: "1.3rem",
              }}
            >
              ENVIROCYCLE
            </span>
          </div>

          {/* LINKS */}
          <nav className="flex flex-col gap-6">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-3xl font-semibold text-[var(--cream)] tracking-wide transition"
                style={{
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? "translateY(0)" : "translateY(20px)",
                  transitionDelay: `${i * 0.08}s`,
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CONTACT CTA */}
          <div className="mt-12 flex flex-col gap-4 w-full max-w-xs">
            <a
              href="tel:+447450435241"
              className="py-3 rounded-full text-center font-semibold"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(245,240,232,0.2)",
                color: "var(--cream)",
              }}
            >
              Call Us
            </a>

            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#contact");
              }}
              className="py-3 rounded-full text-center font-semibold"
              style={{
                background:
                  "linear-gradient(135deg, #d4a017, #f0c040)",
                color: "#0a1f0b",
              }}
            >
              Get a Quote
            </a>
          </div>
        </div>
      </div>
    </>
  );
}