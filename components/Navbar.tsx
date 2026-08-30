"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#our-work", label: "Work" },
  { href: "#packages", label: "Packages" },
  { href: "/areas", label: "Areas" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          height: scrolled ? 80 : 100,
          background: scrolled ? "rgba(10,31,11,0.96)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(212,160,23,0.15)" : "none",
        }}
      >
        <div className="h-full max-w-7xl mx-auto px-5 md:px-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4">
            <div
              className="relative transition-all duration-300"
              style={{
                width: scrolled ? 55 : 70,
                height: scrolled ? 55 : 70,
              }}
            >
              <Image src="/images/logo.webp" alt="Envirocycle" fill className="object-contain" priority />
            </div>
            <span
              className="hidden sm:block font-heading text-cream tracking-widest uppercase transition-all duration-300"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: scrolled ? '1.25rem' : '1.5rem',
              }}
            >
              Envirocycle
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-4 xl:gap-6 text-sm xl:text-[15px]">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  if (link.href.startsWith("#")) {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }
                }}
                className="text-cream/70 hover:text-[var(--gold-light)] transition font-medium whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
            <a href="https://www.instagram.com/envirocycle_ltd/" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-full border border-[rgba(212,160,23,0.3)] text-xs font-bold text-[var(--gold-light)] bg-[rgba(212,160,23,0.1)] hover:scale-105 transition-all whitespace-nowrap">INSTAGRAM</a>
            <Link
              href="/book"
              className="px-6 py-2.5 rounded-full text-xs font-bold hover:scale-105 transition-all whitespace-nowrap"
              style={{ background: "linear-gradient(135deg, #d4a017, #f0c040)", color: "#0a1f0b" }}
            >
              BOOK NOW
            </Link>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden flex flex-col gap-1.5 z-50 p-2">
            <span className={`block w-6 h-0.5 bg-[var(--gold)] transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-[var(--gold)] transition-all ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-[var(--gold)] transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </nav>

      <div
        className="fixed inset-0 z-40 lg:hidden bg-[var(--forest-dark)] flex flex-col items-center justify-center transition-all duration-500"
        style={{ opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? "all" : "none", backdropFilter: "blur(20px)" }}
      >
        <div className="flex flex-col gap-6 text-center">
          <Link
            href="/book"
            onClick={() => setMenuOpen(false)}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-base font-bold mb-2"
            style={{ background: "linear-gradient(135deg, #d4a017, #f0c040)", color: "#0a1f0b" }}
          >
            BOOK NOW
          </Link>
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => handleNavClick(link.href)}
              className="text-4xl font-heading gold-text"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}