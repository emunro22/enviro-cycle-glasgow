import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

const META_TITLE = "FAQs | Envirocycle Glasgow";
const META_DESCRIPTION =
  "Answers to common questions about our waste removal, uplift, recycling and clearance services across Glasgow: areas covered, pricing, licensing, what we can and can't take, and more.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: { canonical: "/faq" },
  openGraph: {
    title: META_TITLE,
    description: META_DESCRIPTION,
    url: "/faq",
    siteName: "Envirocycle Glasgow",
    locale: "en_GB",
    type: "website",
  },
};

const faqs = [
  {
    q: "What areas of Glasgow do you cover?",
    a: "Glasgow and the surrounding areas, including South Lanarkshire, North Lanarkshire, East Dunbartonshire, West Dunbartonshire, Renfrewshire and East Renfrewshire. See our areas page for specific towns.",
  },
  {
    q: "How quickly can you collect?",
    a: "It depends on the job. Bulky uplifts are often available same-day, sometimes within a couple of hours. Furniture disposal is usually within 24 hours (call before 11am for same-day). Garden waste is typically same-day March to October, and within 48 hours over winter. For general waste removal we can usually offer same-day, next-day, or a date you choose, with a 2-hour arrival window.",
  },
  {
    q: "Are you a licensed waste carrier?",
    a: "Yes. We're a SEPA-licensed waste carrier (Licence WCR/R/3021188) and fully insured. Every job is disposed of legally and responsibly, with a waste transfer note provided.",
  },
  {
    q: "Do you recycle what you collect?",
    a: "Yes. We sort and route everything we uplift to licensed recycling or recovery facilities wherever possible, rather than sending it straight to landfill.",
  },
  {
    q: "Do I need to be home for the collection?",
    a: "Not necessarily: as long as the items are accessible and we've agreed the details in advance, we can often collect without you being there. Just mention this when you book or message us on WhatsApp.",
  },
  {
    q: "How much does it cost?",
    a: "It depends on the volume and type of waste. Send a photo via WhatsApp or our booking form for a free, no-obligation quote. There's no minimum charge for small jobs.",
  },
  {
    q: "What items can't you take?",
    a: "We can't take asbestos, clinical or medical waste, chemicals, or hazardous liquids. Garden waste jobs can't include Japanese knotweed, which needs a specialist licensed disposal route. Most other household and commercial items (including paint, batteries, electricals, fridges, freezers and mattresses) are accepted and routed through the correct licensed disposal channel.",
  },
  {
    q: "Can you clear a whole house or just a few items?",
    a: "Both. We handle everything from a single item uplift to a full house, office, or site clearance.",
  },
  {
    q: "Do you provide a waste transfer note?",
    a: "Yes: as a licensed waste carrier, we provide a transfer note for every job, which is useful if you need proof of compliant disposal (for example, for landlords or businesses).",
  },
  {
    q: "Can I book online, or do I need to call?",
    a: "You can book entirely online through our booking form. No need to pick up the phone. If you'd rather talk it through, you can also call or message us on WhatsApp.",
  },
  {
    q: "Do you work with businesses and trade customers?",
    a: "Yes. We work with trade, landlord and commercial customers regularly, with VAT-registered invoices available on request and 14-day payment terms for established trade accounts.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept card and bank transfer. Trade customers with an established account can arrange 14-day payment terms.",
  },
  {
    q: "Is there a minimum charge or call-out fee?",
    a: "No. There's no minimum charge for small jobs and no call-out fee.",
  },
  {
    q: "Are you insured?",
    a: "Yes, we're fully insured as well as SEPA-licensed (Waste Carrier Licence WCR/R/3021188).",
  },
];

export default function FaqPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "FAQ", item: `${SITE_URL}/faq` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navbar />
      <main className="min-h-screen pt-24 pb-20" style={{ background: "var(--forest-dark)" }}>
        {/* Header */}
        <div
          className="relative py-20 px-6 text-center overflow-hidden"
          style={{
            background: "linear-gradient(180deg, rgba(26,68,29,0.3) 0%, transparent 100%)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 0%, rgba(212,160,23,0.08) 0%, transparent 70%)",
            }}
          />
          <p className="section-label mb-4">Help</p>
          <h1
            className="text-5xl md:text-7xl font-heading tracking-wider mb-6"
            style={{ fontFamily: "var(--font-heading)", color: "var(--cream)" }}
          >
            FREQUENTLY{" "}
            <span className="gold-text">ASKED</span>
          </h1>
          <p className="max-w-xl mx-auto text-base md:text-lg" style={{ color: "rgba(245,240,232,0.6)" }}>
            Everything you need to know before booking a job with us.
          </p>
        </div>

        {/* FAQ list */}
        <div className="max-w-3xl mx-auto px-6 mt-12 space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="gold-card rounded-2xl p-6 md:p-8">
              <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--gold-light)" }}>
                {faq.q}
              </h3>
              <p className="leading-relaxed" style={{ color: "rgba(245,240,232,0.75)" }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
