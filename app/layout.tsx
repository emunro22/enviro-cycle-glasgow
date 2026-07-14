import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";
import StickyContactBar from "@/components/StickyContactBar";
import WhatsAppFollowUpPrompt from "@/components/WhatsAppFollowUpPrompt";
import { Analytics } from "@vercel/analytics/next";
import { googleAverageRating, googleReviewCount } from "@/lib/google-reviews-data";
import { SITE_URL } from "@/lib/site";

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

// LocalBusiness structured data — helps Google show you in local/map results
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
  areaServed: {
    "@type": "City",
    name: "Glasgow",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Glasgow",
    addressRegion: "Scotland",
    addressCountry: "GB",
  },
  sameAs: [
    "https://www.instagram.com/envirocycleglasgow_ltd/",
    "https://share.google/cd4yB8qRiWzlzmK8c",
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: googleAverageRating,
    reviewCount: googleReviewCount,
  },
  knowsAbout: [
    "Waste Management",
    "Rubbish Removal",
    "Recycling",
    "Site Clearance",
    "Trade Waste Clearance",
  ],
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
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
        {children}
        <WhatsAppButton />
        <StickyContactBar />
        <WhatsAppFollowUpPrompt />
        <Analytics />
      </body>
    </html>
  );
}
