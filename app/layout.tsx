import type { Metadata, Viewport } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";
import StickyContactBar from "@/components/StickyContactBar";
import WhatsAppFollowUpPrompt from "@/components/WhatsAppFollowUpPrompt";
import CookieConsent from "@/components/CookieConsent";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { Analytics } from "@vercel/analytics/next";
import { googleAverageRating, googleReviewCount, googleReviews, googleReviewsUrl } from "@/lib/google-reviews-data";
import { SITE_URL } from "@/lib/site";
import { areas } from "@/lib/areas";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Envirocycle Glasgow | Waste Management, Uplifts & Recycling",
    template: "%s | Envirocycle Glasgow",
  },
  description:
    "Licensed waste management, rubbish removal, uplifts and recycling across Glasgow and surrounding areas. Same-day service available for homes, businesses and trades. Get a free quote.",
  keywords: [
    "waste management Glasgow",
    "rubbish removal Glasgow",
    "waste removal Glasgow",
    "waste collection Glasgow",
    "house clearance Glasgow",
    "office clearance Glasgow",
    "site clearance Glasgow",
    "trade waste clearance Glasgow",
    "commercial waste Glasgow",
    "bulky waste uplift Glasgow",
    "furniture disposal Glasgow",
    "garden waste removal Glasgow",
    "builders waste removal Glasgow",
    "end of tenancy clearance Glasgow",
    "skip hire alternative Glasgow",
    "man and van rubbish removal Glasgow",
    "same day rubbish removal Glasgow",
    "recycling services Glasgow",
    "licensed waste carrier Glasgow",
    "fly tipping clearance Glasgow",
  ],
  authors: [{ name: "Envirocycle Glasgow" }],
  creator: "Envirocycle Glasgow",
  publisher: "Envirocycle Glasgow",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "Envirocycle Glasgow | Waste Management, Uplifts & Recycling",
    description:
      "Licensed waste management, rubbish removal, uplifts and recycling across Glasgow. Same-day service for homes, businesses and trades.",
    url: SITE_URL,
    siteName: "Envirocycle Glasgow",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Envirocycle Glasgow | Waste Management, Uplifts & Recycling",
    description:
      "Licensed waste management, rubbish removal, uplifts and recycling across Glasgow and surrounding areas.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Every council we serve, derived from the areas data. Kept in sync with
// the /areas pages rather than hardcoded separately.
const councilsServed = Array.from(new Set(areas.map((a) => a.council)));

const sameAs = [
  "https://www.instagram.com/envirocycle_ltd/",
  googleReviewsUrl,
];

// Organization. Separate from LocalBusiness so Google can associate the
// brand/logo with the business regardless of which page it's crawling.
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Envirocycle Glasgow",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
  foundingDate: "2025",
  founders: [
    { "@type": "Person", name: "Chris Heenan" },
    { "@type": "Person", name: "Liam McCormick" },
  ],
  numberOfEmployees: { "@type": "QuantitativeValue", value: 4 },
  sameAs,
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "Envirocycle Glasgow",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

// LocalBusiness structured data. Helps Google show you in local/map results
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#business`,
  name: "Envirocycle Glasgow",
  description:
    "Licensed waste management, rubbish removal, uplifts and recycling services across Glasgow and surrounding areas.",
  url: SITE_URL,
  telephone: "+447450435241",
  email: "envirocycleglasgow@outlook.com",
  image: `${SITE_URL}/images/logo.png`,
  priceRange: "££",
  // Matches the councils listed in /areas and our Google Business Profile
  // service area, rather than just the single city of Glasgow.
  areaServed: councilsServed.map((council) => ({
    "@type": "AdministrativeArea",
    name: council,
  })),
  address: {
    "@type": "PostalAddress",
    addressLocality: "Glasgow",
    addressRegion: "Scotland",
    addressCountry: "GB",
  },
  hasMap: googleReviewsUrl,
  sameAs,
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: googleAverageRating,
    reviewCount: googleReviewCount,
  },
  // A sample of real, curated Google reviews as individual Review items:
  // review dates are stored as relative strings ("2 weeks ago") so are
  // deliberately omitted here rather than emitted as invalid datePublished.
  review: googleReviews.slice(0, 12).map((r) => ({
    "@type": "Review",
    author: { "@type": "Person", name: r.name },
    reviewRating: {
      "@type": "Rating",
      ratingValue: r.stars,
      bestRating: 5,
    },
    reviewBody: r.text,
  })),
  knowsAbout: [
    "Waste Management",
    "Rubbish Removal",
    "Recycling",
    "Site Clearance",
    "Trade Waste Clearance",
  ],
};

// Painting the browser chrome the same colour as the navbar stops iOS
// Safari showing scrolled page content behind the status bar, and
// viewport-fit: cover lets the navbar extend into the notch inset.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a1f0b",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" className={`scroll-smooth ${bebasNeue.variable} ${dmSans.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
        {children}
        <WhatsAppButton />
        <StickyContactBar />
        <WhatsAppFollowUpPrompt />
        <CookieConsent />
        <GoogleAnalytics />
        <Analytics />
      </body>
    </html>
  );
}
