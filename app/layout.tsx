import type { Metadata } from "next";
import Script from "next/script";
import ClientScripts from "@/components/ClientScripts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Signage Pakistan — The Art of Precision | Sign Manufacturer & Installer",
  description:
    "Signage Pakistan designs, manufactures and installs 3D channel letters, pylon signs, lightboxes, LED neon, wayfinding and architectural signage from a 110,000 sq. ft. facility.",
  icons: {
    icon: "/assets/img/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="js" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/assets/img/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Urbanist:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        {children}
        <ClientScripts />
        <Script src="/assets/js/main.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
