import type { Metadata } from "next";
import ServicePageTemplate from "@/components/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Site Clearance Glasgow | House, Garden & End of Tenancy Clearance",
  description:
    "Full site clearance in Glasgow: house clearance, garden clearance, end of tenancy and builders waste removal. Fast, fully licensed, free quotes available.",
  keywords: [
    "site clearance Glasgow",
    "house clearance Glasgow",
    "garden clearance Glasgow",
    "end of tenancy clearance Glasgow",
    "builders waste removal Glasgow",
    "office clearance Glasgow",
  ],
  alternates: { canonical: "/services/site-clearance" },
  openGraph: {
    title: "Site Clearance Glasgow | Envirocycle Glasgow",
    description:
      "House, garden, end of tenancy and builders waste clearance across Glasgow. Fast and fully licensed.",
    url: "https://envirocycleglasgow.com/services/site-clearance",
    type: "website",
  },
};

export default function SiteClearancePage() {
  return (
    <ServicePageTemplate
      slug="/services/site-clearance"
      eyebrow="Homes, Gardens & Premises"
      title="Site Clearance"
      titleAccent="Glasgow"
      intro="Whole-property and outdoor clearances across Glasgow: house clearance, garden clearance, end of tenancy clear-outs and builders waste removal, handled quickly and responsibly."
      sections={[
        {
          heading: "House and end of tenancy clearance",
          body: [
            "Moving out, clearing a property or preparing a rental for new tenants? Envirocycle clears entire properties across Glasgow (furniture, white goods, general clutter and rubbish), leaving the space empty and ready.",
            "End of tenancy clearances are handled to a deadline so you can hand over keys on time.",
          ],
        },
        {
          heading: "Garden and outdoor clearance",
          body: [
            "Overgrown gardens, green waste, old decking, broken furniture and general outdoor debris. We clear it all. The result is a tidy, usable space without you having to make endless trips to the tip.",
          ],
        },
        {
          heading: "Builders waste and post-renovation clearance",
          body: [
            "After building or renovation work, sites are often left with rubble, offcuts, packaging and general construction waste. We remove builders waste across Glasgow so the site is clean and safe. With full waste transfer documentation for trade clients.",
          ],
        },
        {
          heading: "Probate and downsizing clearances, handled discreetly",
          body: [
            "Clearing a family home after a bereavement, or helping someone downsize into a smaller property, needs a different approach from a standard job: patience, no rushing decisions on the day, and a crew that treats the property and its contents with respect. We've done enough of these across Glasgow and South Lanarkshire to know the pace that works, and we're happy to work room by room rather than clearing everything in one go if that suits the family better.",
            "Access matters too: tenement stairs, narrow closes, and properties without off-street parking are all routine for us, not a reason to charge more.",
          ],
        },
      ]}
      features={[
        "Full house and flat clearances",
        "End of tenancy clear-outs to deadline",
        "Garden and green waste clearance",
        "Builders and post-renovation waste removal",
        "Office and commercial premises clearance",
        "Licensed disposal with recycling wherever possible",
      ]}
      faqs={[
        {
          q: "Do you do full house clearances in Glasgow?",
          a: "Yes. We clear entire properties (furniture, appliances, clutter and rubbish) across Glasgow and the surrounding areas, leaving the space empty and ready.",
        },
        {
          q: "Can you clear a property for end of tenancy?",
          a: "Yes, end of tenancy clearances are a core part of our site clearance service and we work to your handover deadline.",
        },
        {
          q: "Do you remove builders waste?",
          a: "Yes. We remove rubble, offcuts and general construction waste, and provide full waste transfer notes for trade clients.",
        },
        {
          q: "How quickly can a clearance be booked?",
          a: "Often same-day or next-day depending on the size of the job. Get in touch for a free quote and we will confirm availability.",
        },
        {
          q: "Can you handle a probate clearance sensitively?",
          a: "Yes. We regularly clear properties as part of probate and downsizing, working at whatever pace the family needs and treating the contents with care.",
        },
        {
          q: "Do you charge more for tenement or flat access?",
          a: "No: stairs, closes and properties without parking are part of the standard service across Glasgow.",
        },
      ]}
      related={[
        { href: "/services/bulky-waste-uplifts", label: "Bulky Waste Uplifts" },
        { href: "/services/trade-waste-clearance", label: "Trade Waste Clearance" },
        { href: "/services/waste-management", label: "Waste Management" },
        { href: "/services/recycling", label: "Recycling" },
      ]}
    />
  );
}