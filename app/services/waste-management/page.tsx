import type { Metadata } from "next";
import ServicePageTemplate from "@/components/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Waste Management Glasgow | Commercial & Residential Collections",
  description:
    "Reliable, fully licensed waste management in Glasgow for homes and businesses. Scheduled collections, compliant disposal and recycling. Get a free quote today.",
  keywords: [
    "waste management Glasgow",
    "commercial waste Glasgow",
    "waste collection Glasgow",
    "business waste Glasgow",
    "licensed waste carrier Glasgow",
  ],
  alternates: { canonical: "/services/waste-management" },
  openGraph: {
    title: "Waste Management Glasgow | Envirocycle Glasgow",
    description:
      "Reliable, fully licensed waste management in Glasgow for homes and businesses.",
    url: "https://envirocycleglasgow.com/services/waste-management",
    type: "website",
  },
};

export default function WasteManagementPage() {
  return (
    <ServicePageTemplate
      slug="/services/waste-management"
      eyebrow="Commercial & Residential"
      title="Waste Management"
      titleAccent="Glasgow"
      intro="Dependable waste management for Glasgow homes and businesses — scheduled collections, fully compliant disposal and a recycling-first approach that keeps waste out of landfill."
      sections={[
        {
          heading: "Waste collection built around your schedule",
          body: [
            "Whether you run a busy commercial premises or simply need household waste handled properly, Envirocycle provides waste management across Glasgow and the surrounding areas on a schedule that suits you. From one-off collections to regular weekly or fortnightly pick-ups, we keep things flexible.",
            "Our team handles general, commercial and bulky waste, removing the hassle of managing disposal yourself. You stay focused on your day; we take care of the rest.",
          ],
        },
        {
          heading: "Fully licensed and compliant disposal",
          body: [
            "Envirocycle is a registered waste carrier (SEPA WCR/R/3021188). Every commercial collection comes with the correct waste transfer documentation, so your business stays compliant with environmental regulations.",
            "Waste is taken to licensed facilities and handled responsibly — no fly-tipping, no shortcuts, full accountability from collection to disposal.",
          ],
        },
        {
          heading: "A recycling-first approach",
          body: [
            "Wherever possible we segregate and divert waste for recycling rather than sending it to landfill. It is better for the environment and, for many businesses, better for your sustainability reporting too.",
          ],
        },
      ]}
      features={[
        "Regular scheduled collections — weekly, fortnightly or one-off",
        "General, commercial and bulky waste handled",
        "Full waste transfer notes for business compliance",
        "Licensed disposal at permitted facilities",
        "Recycling-focused to minimise landfill",
        "Same-day collection often available across Glasgow",
      ]}
      faqs={[
        {
          q: "Do you cover commercial and residential waste management?",
          a: "Yes. Envirocycle handles waste management for both businesses and households across Glasgow and the surrounding areas, from regular commercial collections to one-off residential pick-ups.",
        },
        {
          q: "Are you a licensed waste carrier?",
          a: "Yes — Envirocycle is registered with SEPA under WCR/R/3021188 and provides full waste transfer documentation for commercial collections.",
        },
        {
          q: "How quickly can you collect?",
          a: "Same-day collection is often available across Glasgow. Get in touch for a free quote and we will confirm the earliest slot.",
        },
        {
          q: "What areas do you cover?",
          a: "We cover Glasgow and the surrounding areas. If you are nearby and not sure, just ask.",
        },
      ]}
      related={[
        { href: "/services/trade-waste-clearance", label: "Trade Waste Clearance" },
        { href: "/services/bulky-waste-uplifts", label: "Bulky Waste Uplifts" },
        { href: "/services/recycling", label: "Recycling" },
        { href: "/services/site-clearance", label: "Site Clearance" },
      ]}
    />
  );
}