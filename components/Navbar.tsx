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
    const handleScroll = () => setScrolled(window.scrollY > 20);
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
          // Increased height to 80px to accommodate the larger logo
          height: scrolled ? 70 : 85,
          background: scrolled ? "rgba(10,31,11,0.96)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(212,160,23,0.15)" : "none",
        }}
      >
        <div className="h-full max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between">

          {/* LOGO - Made significantly bigger */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-[65px] h-[65px] md:w-[85px] md:h-[85px] transition-all duration-300">
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
                fontSize: "1.2rem",
              }}
            >
              ENVIROCYCLE
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-8 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-[rgba(245,240,232,0.72)] hover:text-[var(--gold-light)] transition font-medium"
              >
                {link.label}
              </Link>
            ))}

            <a
              href="https://www.instagram.com/envirocycleglasgow_ltd/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full border text-sm font-semibold transition-all hover:scale-105"
              style={{
                borderColor: "rgba(212,160,23,0.35)",
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
            className="md:hidden flex flex-col justify-center items-center w-12 h-12 gap-1.5 z-50"
            aria-label="Toggle menu"
          >
            <span
              className="block w-7 h-0.5 bg-[var(--gold)] transition-all duration-300"
              style={{
                transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
              }}
            />
            <span
              className="block w-7 h-0.5 bg-[var(--gold)] transition-all duration-300"
              style={{
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block w-7 h-0.5 bg-[var(--gold)] transition-all duration-300"
              style={{
                transform: menuOpen ? "rotate(-45deg) translate(6px, -6px)" : "none",
              }}
            />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div
        className="fixed inset-0 z-40 md:hidden transition-all duration-500"
        style={{
          background: "rgba(10,31,11,0.99)",
          backdropFilter: "blur(25px)",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "all" : "none",
        }}
      >
        <div className="flex flex-col justify-center items-center h-full px-6 text-center">

          {/* MOBILE MENU LOGO */}
          <div className="flex flex-col items-center gap-4 mb-12">
            <div className="relative w-[100px] h-[100px]">
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
                letterSpacing: "0.15em",
                fontSize: "1.5rem",
              }}
            >
              ENVIROCYCLE
            </span>
          </div>

          {/* MOBILE LINKS */}
          <nav className="flex flex-col gap-5">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-3xl font-bold text-[var(--cream)] tracking-wide transition"
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

          {/* MOBILE CONTACT CTA */}
          <div className="mt-12 flex flex-col gap-4 w-full max-w-xs">
            <a
              href="tel:+447450435241"
              className="py-4 rounded-full text-center font-bold text-lg"
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
              className="py-4 rounded-full text-center font-bold text-lg"
              style={{
                background:
                  "linear-gradient(135deg, #d4a017, #f0c040)",
                color: "#0a1f0b",
                boxShadow: "0 10px 30px rgba(212,160,23,0.3)"
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