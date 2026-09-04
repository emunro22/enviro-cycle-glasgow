import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Envirocycle Glasgow",
  alternates: { canonical: "/privacy" },
};

const sections = [
  {
    number: "01",
    title: "Who we are",
    content:
      "Envirocycle Glasgow provides waste management, rubbish uplift, site clearance and recycling services across Glasgow and surrounding areas. This policy explains what personal data we collect through our website, why, and how we handle it. Contact: envirocycleglasgow@outlook.com.",
  },
  {
    number: "02",
    title: "What we collect",
    content:
      "When you use our contact form, booking form, or WhatsApp, we collect the details you provide: typically your name, email address, phone number, property address, a description of the waste or job, your preferred date, and any photos you upload of the items to be cleared. If you use our tip finder or areas pages, we may also see your general location (postcode area) where you provide it.",
  },
  {
    number: "03",
    title: "How we use it",
    content:
      "We use your details to respond to enquiries, provide quotes, schedule and carry out bookings, and to send service-related emails such as booking confirmations. With your consent, we may also send a follow-up email a day or two after a job asking how it went and inviting a Google review. You can opt out at any time by replying to that email or contacting us directly.",
  },
  {
    number: "04",
    title: "Cookies & analytics",
    content:
      "We use a small number of cookies. Essential cookies (for example, keeping the admin area secure) are always on and don't require consent. We also use privacy-friendly, cookieless traffic analytics (Vercel Analytics) to see which pages are popular. If you accept analytics cookies via our cookie banner, we additionally use Google Analytics to understand site usage in more detail. This only loads after you accept, and never before. You can change your choice at any time by clearing your browser's site data for this domain and reloading the page.",
  },
  {
    number: "05",
    title: "Who we share it with",
    content:
      "We use trusted third-party processors to run our website and business: Vercel (hosting and file storage for uploaded photos), Neon (database), and Resend (sending emails). These providers only process your data on our instructions to deliver the service. We do not sell your data to anyone.",
  },
  {
    number: "06",
    title: "How long we keep it",
    content:
      "We keep enquiry and booking records for as long as reasonably needed to provide our service, deal with any follow-up, and meet our accounting and legal obligations, after which we delete or anonymise it.",
  },
  {
    number: "07",
    title: "Your rights",
    content:
      "Under UK GDPR, you have the right to ask what personal data we hold about you, request a copy of it, ask us to correct or delete it, or object to how we use it. To exercise any of these rights, email envirocycleglasgow@outlook.com. If you're unhappy with how we've handled your data, you can also complain to the Information Commissioner's Office (ico.org.uk).",
  },
  {
    number: "08",
    title: "Children",
    content:
      "Our services are aimed at adults arranging waste collection for a property. We don't knowingly collect personal data from children.",
  },
  {
    number: "09",
    title: "Changes to this policy",
    content:
      "We may update this Privacy Policy from time to time to reflect changes to our website or legal requirements. The \"last updated\" date below shows when it was last revised.",
  },
];

export default function PrivacyPage() {
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
            PRIVACY{" "}
            <span className="gold-text">POLICY</span>
          </h1>
          <p
            className="max-w-xl mx-auto text-base md:text-lg"
            style={{ color: "rgba(245,240,232,0.6)" }}
          >
            Last updated: August 2026
          </p>
        </div>

        {/* Sections list */}
        <div className="max-w-3xl mx-auto px-6 mt-12 space-y-6">
          {sections.map((section) => (
            <div
              key={section.number}
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
                {section.number}
              </div>
              <div>
                <h3
                  className="text-lg font-semibold mb-3"
                  style={{ color: "var(--gold-light)" }}
                >
                  {section.title}
                </h3>
                <p
                  className="leading-relaxed"
                  style={{ color: "rgba(245,240,232,0.75)" }}
                >
                  {section.content}
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
