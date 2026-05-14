import type { Metadata } from "next";
import ServicePageTemplate from "@/components/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Trade Waste Clearance Glasgow | Compliant Business Waste Collection",
  description:
    "Trade waste clearance for Glasgow businesses and trades. Flexible collections, full waste transfer notes and compliant, recycling-focused disposal. Get a free quote.",
  keywords: [
    "trade waste clearance Glasgow",
    "trade waste Glasgow",
    "business waste collection Glasgow",
    "commercial waste clearance Glasgow",
    "construction waste removal Glasgow",
  ],
  alternates: { canonical: "/services/trade-waste-clearance" },
  openGraph: {
    title: "Trade Waste Clearance Glasgow | Envirocycle Glasgow",
    description:
      "Flexible, fully compliant trade waste clearance for Glasgow businesses and trades.",
    url: "https://envirocycleglasgow.com/services/trade-waste-clearance",
    type: "website",
  },
};

export default function TradeWasteClearancePage() {
  return (
    <ServicePageTemplate
      slug="/services/trade-waste-clearance"
      eyebrow="Reliable & Fully Compliant"
      title="Trade Waste"
      titleAccent="Clearance"
      intro="Efficient, responsible trade waste clearance for businesses and trades across Glasgow and Scotland — flexible collections, full compliance, and a recycling-focused approach so you can stay focused on the job."
      sections={[
        {
          heading: "Built for businesses and trades",
          body: [
            "Construction, landscaping, joinery, retail or office — whatever your trade, Envirocycle keeps waste off your hands. We offer flexible collections that fit around your jobs and sites rather than forcing you onto a fixed schedule.",
            "It means less time managing waste and more time on the work that pays.",
          ],
        },
        {
          heading: "Full compliance, every collection",
          body: [
            "Trade waste comes with legal duties. Every collection includes full waste transfer notes and proper documentation, and Envirocycle is a registered waste carrier (SEPA WCR/R/3021188), so your business stays on the right side of the regulations.",
            "We handle collection, sorting and recycling so compliance is one less thing to think about.",
          ],
        },
        {
          heading: "Recycling-focused, minimal disruption",
          body: [
            "We sort and recycle as much trade waste as possible rather than defaulting to landfill — better for the environment and for your own sustainability commitments. And our service is built to be fast and low-disruption, so your site keeps moving.",
          ],
        },
      ]}
      features={[
        "Flexible collections for businesses and trades",
        "Full waste transfer notes and compliance documentation",
        "Registered waste carrier — SEPA WCR/R/3021188",
        "Construction, landscaping and general trade waste handled",
        "Recycling-focused waste management",
        "Fast, reliable service with minimal disruption",
      ]}
      faqs={[
        {
          q: "Do you provide waste transfer notes?",
          a: "Yes. Every trade waste collection includes full waste transfer documentation so your business stays compliant with environmental regulations.",
        },
        {
          q: "Can collections fit around my work schedule?",
          a: "Yes — we offer flexible collections designed to fit around your jobs and sites rather than a fixed timetable.",
        },
        {
          q: "What types of trade waste do you take?",
          a: "We handle waste from construction, landscaping, joinery, retail, offices and most other trades. Get in touch with your details for a tailored quote.",
        },
        {
          q: "Are you a registered waste carrier?",
          a: "Yes, Envirocycle is registered with SEPA under WCR/R/3021188 and operates fully licensed and compliant.",
        },
      ]}
      related={[
        { href: "/services/waste-management", label: "Waste Management" },
        { href: "/services/site-clearance", label: "Site Clearance" },
        { href: "/services/recycling", label: "Recycling" },
        { href: "/services/bulky-waste-uplifts", label: "Bulky Waste Uplifts" },
      ]}
    />
  );
}