import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Envirocycle Glasgow",
};

const terms = [
  {
    number: "01",
    title: "Introduction",
    content:
      "By using our website, you agree to comply with these terms. If you do not agree, please do not use our site.",
  },
  {
    number: "02",
    title: "Services Provided",
    content:
      "Envirocycle provides waste management, uplifting, and recycling services, including waste collection, site clearance, and recycling solutions.",
  },
  {
    number: "03",
    title: "Use of Website",
    content:
      "You agree to use this website for lawful purposes and not engage in activities that could harm our business or other users.",
  },
  {
    number: "04",
    title: "Account Creation",
    content:
      "If required, you agree to provide accurate details when creating an account and are responsible for keeping your account secure.",
  },
  {
    number: "05",
    title: "Payment",
    content:
      "Payment for services is due as per the pricing displayed on the website. All payments are final and non-refundable unless otherwise stated.",
  },
  {
    number: "06",
    title: "Intellectual Property",
    content:
      "All content on this site, including text, images, and logos, is owned by Envirocycle and may not be used without permission.",
  },
  {
    number: "07",
    title: "Links to Third-Party Websites",
    content:
      "Our website may contain links to third-party sites. We are not responsible for the content or practices of these sites.",
  },
  {
    number: "08",
    title: "Limitation of Liability",
    content:
      "Envirocycle is not liable for any damages or losses resulting from your use of the website or services.",
  },
  {
    number: "09",
    title: "Privacy Policy",
    content:
      "Your use of this site is also governed by our Privacy Policy, which explains how we handle your personal data.",
  },
  {
    number: "10",
    title: "Changes to Terms",
    content:
      "We may update these Terms and Conditions at any time. Your continued use of the website means you accept the latest terms.",
  },
  {
    number: "11",
    title: "Contact",
    content:
      "For any questions or concerns, please contact us at: envirocycleglasgow@outlook.com",
  },
];

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20" style={{ background: "var(--forest-dark)" }}>
        {/* Header */}
        <div
          className="relative py-20 px-6 text-center overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(26,68,29,0.3) 0%, transparent 100%)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 0%, rgba(212,160,23,0.08) 0%, transparent 70%)",
            }}
          />
          <p className="section-label mb-4">Legal</p>
          <h1
            className="text-5xl md:text-7xl font-heading tracking-wider mb-6"
            style={{ fontFamily: "var(--font-heading)", color: "var(--cream)" }}
          >
            TERMS &{" "}
            <span className="gold-text">CONDITIONS</span>
          </h1>
          <p
            className="max-w-xl mx-auto text-base md:text-lg"
            style={{ color: "rgba(245,240,232,0.6)" }}
          >
            Last updated: January 2025
          </p>
        </div>

        {/* Terms list */}
        <div className="max-w-3xl mx-auto px-6 mt-12 space-y-6">
          {terms.map((term) => (
            <div
              key={term.number}
              className="gold-card rounded-2xl p-6 md:p-8 flex gap-6 items-start"
            >
              <div
                className="text-3xl font-heading shrink-0 leading-none"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "rgba(212,160,23,0.3)",
                  fontSize: "2.5rem",
                }}
              >
                {term.number}
              </div>
              <div>
                <h3
                  className="text-lg font-semibold mb-3"
                  style={{ color: "var(--gold-light)" }}
                >
                  {term.title}
                </h3>
                <p
                  className="leading-relaxed"
                  style={{ color: "rgba(245,240,232,0.75)" }}
                >
                  {term.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
