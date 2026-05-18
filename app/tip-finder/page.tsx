import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TipFinder from "@/components/TipFinder";

// Internal ops tool — keep out of search engines. Supplier rates are
// commercially sensitive; consider adding a PIN gate before launching.
export const metadata: Metadata = {
  title: "Tip Finder — Internal Tool",
  description: "Find the cheapest disposal route per material across our network.",
  robots: { index: false, follow: false },
};

export default function TipFinderPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24">
        <TipFinder />
      </div>
      <Footer />
    </main>
  );
}