import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Envirocycle Glasgow | Waste Management, Uplifts & Recycling",
  description: "Professional waste management, uplift services and recycling solutions for Glasgow and surrounding areas. Commercial and residential waste collection.",
  keywords: "waste management Glasgow, uplift services Glasgow, recycling Glasgow, commercial waste collection, residential waste removal",
  openGraph: {
    title: "Envirocycle Glasgow",
    description: "Efficient Waste Solutions, Sustainable Future",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>{children}</body>
    </html>
  );
}
