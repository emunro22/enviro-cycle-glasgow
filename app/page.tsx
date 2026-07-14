import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import BeforeAfter from "@/components/BeforeAfter";
import Packages from "@/components/Packages";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import GoogleReviews from "@/components/GoogleReviews";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import OurWork from "@/components/Ourwork";
import ScrollAnimations from "@/components/ScrollAnimations";

// This is now a Server Component — no "use client".
// That's what lets metadata (in layout.tsx) and structured data be picked
// up cleanly by search engine crawlers.

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Drives the .in-view scroll animations from globals.css */}
      <ScrollAnimations />

      <Navbar />
      <Hero />
      <Services />
      <Stats />
      <BeforeAfter />
      <OurWork />
      <Packages />
      <Testimonials />
      <GoogleReviews />
      <Contact />
      <Footer />
    </main>
  );
}