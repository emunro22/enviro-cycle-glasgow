import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import BeforeAfter from "@/components/BeforeAfter";
import Packages from "@/components/Packages";
import Stats from "@/components/Stats";
import GoogleReviews from "@/components/GoogleReviews";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import OurWork from "@/components/Ourwork";
import ScrollAnimations from "@/components/ScrollAnimations";
import { sql, type Project } from "@/lib/db";
import { getReviewsForDisplay } from "@/lib/google-places-sync";

// This is now a Server Component, no "use client".
// That's what lets metadata (in layout.tsx) and structured data be picked
// up cleanly by search engine crawlers.

export default async function Home() {
  // Fetched here (server-side) rather than inside OurWork via useEffect, so
  // the portfolio grid is present in the initial server-rendered HTML for
  // SEO/crawlers instead of only appearing after client-side hydration.
  let projects: Project[] = [];
  try {
    projects = (await sql`
      SELECT * FROM projects ORDER BY display_order ASC, created_at DESC
    `) as Project[];
  } catch (err) {
    console.error("Failed to load projects", err);
  }

  // Same reasoning as projects above: fetched server-side so the review
  // text is in the initial HTML for crawlers, and so the section renders
  // its real content immediately instead of swapping in after hydration.
  const reviewsData = await getReviewsForDisplay();

  return (
    <main className="min-h-screen">
      {/* Drives the .in-view scroll animations from globals.css */}
      <ScrollAnimations />

      <Navbar />
      <Hero />
      <Services />
      <Stats />
      <BeforeAfter />
      <OurWork projects={projects} />
      <Packages />
      <GoogleReviews initial={reviewsData} />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  );
}