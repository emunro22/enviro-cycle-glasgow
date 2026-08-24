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
        {
          heading: "Commercial waste removal across Glasgow",
          body: [
            "If you're searching for commercial waste removal in Glasgow, chances are waste is building up between council collections, or your lease doesn't come with a shared bin. Envirocycle steps in as a straightforward alternative — no waiting on a communal skip, no contract lock-in unless you want one. We work with shops, cafes, offices, salons and light industrial units across the city, with the same crew and van each time so you're never re-explaining the job.",
            "Pricing is agreed up front, either per collection or on a rolling schedule — whichever suits your cash flow better. Most Glasgow and Lanarkshire businesses we work with settle into a fortnightly or monthly rhythm within the first month.",
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
        {
          q: "Do you offer commercial waste contracts, or one-off collections?",
          a: "Both — some businesses want a rolling contract with a fixed collection day, others just need an ad-hoc uplift when things build up. We do either, with no minimum tie-in unless you want the predictability of a set schedule.",
        },
        {
          q: "What's the difference between this and a council trade waste permit?",
          a: "A council trade waste permit ties you to fixed collection days and bin sizes. We collect on your schedule, take a wider range of materials, and it often works out cheaper for smaller or irregular volumes.",
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