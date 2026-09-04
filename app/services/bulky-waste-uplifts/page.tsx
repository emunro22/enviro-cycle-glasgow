import type { Metadata } from "next";
import ServicePageTemplate from "@/components/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Bulky Waste Uplifts Glasgow | Furniture & Appliance Removal",
  description:
    "Same-day bulky waste uplifts in Glasgow. Furniture, appliances, white goods and garden waste removed quickly and responsibly. Free quotes. Get in touch today.",
  keywords: [
    "bulky waste uplift Glasgow",
    "furniture removal Glasgow",
    "rubbish removal Glasgow",
    "white goods removal Glasgow",
    "appliance disposal Glasgow",
    "same day rubbish removal Glasgow",
  ],
  alternates: { canonical: "/services/bulky-waste-uplifts" },
  openGraph: {
    title: "Bulky Waste Uplifts Glasgow | Envirocycle Glasgow",
    description:
      "Same-day bulky waste uplifts in Glasgow: furniture, appliances and garden waste removed responsibly.",
    url: "https://envirocycleglasgow.com/services/bulky-waste-uplifts",
    type: "website",
  },
};

export default function BulkyWasteUpliftsPage() {
  return (
    <ServicePageTemplate
      slug="/services/bulky-waste-uplifts"
      eyebrow="Same-Day Available"
      title="Bulky Waste"
      titleAccent="Uplifts"
      intro="Got something big to shift? Envirocycle removes furniture, appliances, white goods and garden waste across Glasgow: often same-day, always responsibly disposed of or donated."
      sections={[
        {
          heading: "A faster, easier alternative to a skip",
          body: [
            "Hiring a skip means permits, waiting, and loading it yourself. A bulky waste uplift from Envirocycle means our team turns up, does the lifting, and clears it away. Usually the same day or at a time that suits you.",
            "It is the simplest way to get rid of bulky items from a home, flat or business anywhere in Glasgow.",
          ],
        },
        {
          heading: "What we uplift",
          body: [
            "Sofas, beds, wardrobes and other furniture; fridges, freezers, washing machines and other white goods; garden waste and general household clutter. If you are not sure whether we can take it, just ask when you get your quote.",
            "Our team is equipped for heavy-duty lifting, so awkward items up flights of stairs are no problem.",
          ],
        },
        {
          heading: "Responsibly disposed of, or donated",
          body: [
            "Items in usable condition are donated where possible. Everything else is taken to licensed facilities and recycled wherever it can be, so your uplift has the smallest possible environmental impact.",
          ],
        },
        {
          heading: "Same-day service across Glasgow and Lanarkshire",
          body: [
            "Because we run our own vans rather than booking through a call centre, we can usually slot a bulky uplift in the same day. Sometimes within a couple of hours if you catch us between jobs. It's the option people reach for when a sofa's blocking the hallway before a viewing, or an old fridge needs to go before a new one's delivered.",
            "We cover flats and tenements as readily as houses with driveways: stair carries, tight closes and awkward corners are routine for us, not an extra charge.",
          ],
        },
      ]}
      features={[
        "Same-day or scheduled uplifts across Glasgow",
        "Furniture, appliances and white goods removed",
        "Garden waste and general clutter cleared",
        "All lifting and loading done by our team",
        "Usable items donated where possible",
        "Licensed, responsible disposal and recycling",
      ]}
      faqs={[
        {
          q: "Can you do a same-day uplift in Glasgow?",
          a: "Yes, same-day uplifts are often available across Glasgow. Contact us with what you need moved and we will confirm the earliest slot.",
        },
        {
          q: "Do I need to carry items outside first?",
          a: "No. Our team handles the lifting and loading, including from inside the property and up or down stairs.",
        },
        {
          q: "Can you take fridges and freezers?",
          a: "Yes, we remove white goods including fridges, freezers and washing machines, and dispose of them at the correct licensed facilities.",
        },
        {
          q: "How much does a bulky waste uplift cost?",
          a: "Pricing depends on the volume and type of items. Get in touch for a free, no-obligation quote.",
        },
        {
          q: "Do you charge extra for stairs or flats?",
          a: "No: carrying items down stairs or through tenement closes is part of the standard service, not an add-on.",
        },
        {
          q: "What if I only have one item to get rid of?",
          a: "That's fine: plenty of our uplifts are a single sofa, mattress or fridge. Pricing is by volume, so a single item costs less than a full load.",
        },
      ]}
      related={[
        { href: "/services/site-clearance", label: "Site Clearance" },
        { href: "/services/waste-management", label: "Waste Management" },
        { href: "/services/recycling", label: "Recycling" },
        { href: "/services/trade-waste-clearance", label: "Trade Waste Clearance" },
      ]}
    />
  );
}