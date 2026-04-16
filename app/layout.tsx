import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Envirocycle Glasgow | Waste Management, Uplifts & Recycling",
  description: "Professional waste management services in Glasgow.",

icons: {
  icon: "/favicon.ico",
  shortcut: "/favicon.ico",
  apple: "/favicon.ico",
},

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