import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GoogleReviews from "@/components/GoogleReviews";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { googleAverageRating, googleReviewCount } from "@/lib/google-reviews-data";

const META_TITLE = "Reviews | Envirocycle Glasgow";
const META_DESCRIPTION = `Rated ${googleAverageRating.toFixed(1)}/5 from ${googleReviewCount} Google reviews. See what customers across Glasgow say about our waste removal, uplift and recycling services.`;

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: { canonical: "/reviews" },
  openGraph: {
    title: META_TITLE,
    description: META_DESCRIPTION,
    url: "/reviews",
    siteName: "Envirocycle Glasgow",
    locale: "en_GB",
    type: "website",
  },
};

export default function ReviewsPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Reviews", item: `${SITE_URL}/reviews` },
    ],
  };

  return (
    <main className="min-h-screen" style={{ background: "var(--forest-dark)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navbar />

      {/* Header */}
      <div
        className="relative pt-32 pb-16 md:pt-40 md:pb-20 px-6 text-center overflow-hidden"
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
        <p className="section-label mb-4">Reviews</p>
        <h1
          className="text-5xl md:text-7xl font-heading tracking-wider mb-6"
          style={{ fontFamily: "var(--font-heading)", color: "var(--cream)" }}
        >
          WHAT GLASGOW{" "}
          <span className="gold-text">SAYS</span>
        </h1>
        <p
          className="max-w-xl mx-auto text-base md:text-lg"
          style={{ color: "rgba(245,240,232,0.6)" }}
        >
          Rated {googleAverageRating.toFixed(1)}/5 from {googleReviewCount} Google reviews —
          every one from a real customer.
        </p>
      </div>

      <GoogleReviews />
      <Footer />
    </main>
  );
}
