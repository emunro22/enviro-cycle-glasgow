import type { Metadata } from "next";
import ServicePageTemplate from "@/components/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Recycling Services Glasgow | Business & Commercial Recycling",
  description:
    "Recycling services for Glasgow businesses and homes. Segregated collection of paper, plastic, metal and glass with recycling certification for businesses. Free quote.",
  keywords: [
    "recycling services Glasgow",
    "commercial recycling Glasgow",
    "business recycling Glasgow",
    "waste recycling Glasgow",
    "recycling collection Glasgow",
  ],
  alternates: { canonical: "/services/recycling" },
  openGraph: {
    title: "Recycling Services Glasgow | Envirocycle Glasgow",
    description:
      "Segregated recycling collection for Glasgow businesses and homes, with recycling certification available.",
    url: "https://envirocycleglasgow.com/services/recycling",
    type: "website",
  },
};

export default function RecyclingPage() {
  return (
    <ServicePageTemplate
      slug="/services/recycling"
      eyebrow="Sustainable Waste Solutions"
      title="Recycling Services"
      titleAccent="Glasgow"
      intro="Segregated recycling collection for Glasgow businesses and homes: paper, plastic, metal and glass diverted from landfill, with recycling certification available for businesses."
      sections={[
        {
          heading: "Recycling that actually gets recycled",
          body: [
            "Envirocycle provides segregated collection of recyclable materials across Glasgow, covering paper, cardboard, plastic, metal and glass. Materials are kept separated and sent to the right facilities so they genuinely get recycled rather than ending up mixed and landfilled.",
            "On-site and kerbside pick-up options are available depending on what works for your premises.",
          ],
        },
        {
          heading: "Recycling certification for businesses",
          body: [
            "For commercial clients, we can provide certification of recycled waste: useful evidence for sustainability reporting, tenders and demonstrating your environmental commitments to customers.",
            "It is a straightforward way to back up your green credentials with documentation.",
          ],
        },
        {
          heading: "Lowering your carbon footprint",
          body: [
            "Every tonne diverted from landfill reduces emissions and environmental impact. Whether you are a household trying to do the right thing or a business with sustainability targets, our recycling service makes it easy.",
          ],
        },
        {
          heading: "Where your recycling actually goes",
          body: [
            "Materials collected for recycling go to licensed processing facilities rather than a general waste transfer station, which is what keeps them genuinely recycled rather than quietly landfilled further down the chain. We can tell you which facility handled a specific collection if you need that detail for a tender or audit.",
            "For households, recycling collection works well alongside a wider clear-out: old furniture and general clutter uplifted at the same time as the recyclable materials, rather than needing two separate visits.",
          ],
        },
      ]}
      features={[
        "Segregated collection of recyclable materials",
        "Paper, cardboard, plastic, metal and glass recycling",
        "On-site or kerbside pick-up options",
        "Recycling certification available for businesses",
        "Materials sent to permitted recycling facilities",
        "Helps reduce your landfill use and carbon footprint",
      ]}
      faqs={[
        {
          q: "What materials do you recycle?",
          a: "We collect and recycle paper, cardboard, plastic, metal and glass. If you have a specific material in mind, get in touch and we will let you know.",
        },
        {
          q: "Can you provide proof of recycling for my business?",
          a: "Yes. For commercial clients we can provide certification of recycled waste, which is useful for sustainability reporting and tenders.",
        },
        {
          q: "Do you offer kerbside collection?",
          a: "Yes. Both on-site and kerbside pick-up options are available across Glasgow depending on your premises.",
        },
        {
          q: "Is recycling collection available for households?",
          a: "Yes, our recycling service is available to both businesses and households across Glasgow and the surrounding areas.",
        },
        {
          q: "Can I combine a recycling collection with a general clearance?",
          a: "Yes. Most households book recycling alongside a wider uplift, so recyclable materials and general clutter are collected in a single visit.",
        },
        {
          q: "Where does the material actually get processed?",
          a: "We use licensed recycling facilities across the Central Belt, and can confirm which one handled a specific collection if you need it for reporting.",
        },
      ]}
      related={[
        { href: "/services/waste-management", label: "Waste Management" },
        { href: "/services/trade-waste-clearance", label: "Trade Waste Clearance" },
        { href: "/services/bulky-waste-uplifts", label: "Bulky Waste Uplifts" },
        { href: "/services/site-clearance", label: "Site Clearance" },
      ]}
    />
  );
}