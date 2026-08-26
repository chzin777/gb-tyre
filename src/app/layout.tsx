import type { Metadata, Viewport } from "next";
import { Archivo, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  business,
  fullAddress,
  openingHours,
  services,
} from "@/lib/site";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gbtyreservices.co.uk"),
  title: {
    default: "GB Tyre Services | Tyre fitting and puncture repair in Edinburgh",
    template: "%s | GB Tyre Services",
  },
  description:
    "New tyres, puncture repairs, wheel balancing and TPMS service at 24b Pennywell Rd, Edinburgh. Same-day fitting, price matched, walk-ins welcome.",
  keywords: [
    "tyre shop Edinburgh",
    "puncture repair Edinburgh",
    "wheel balancing Edinburgh",
    "new tyres Pennywell Road",
    "TPMS service Edinburgh",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://gbtyreservices.co.uk",
    siteName: business.name,
    title: "GB Tyre Services | Tyre fitting and puncture repair in Edinburgh",
    description:
      "Same-day tyre fitting, puncture repairs and wheel balancing on Pennywell Road. Most jobs done in 30 to 60 minutes.",
  },
  twitter: {
    card: "summary_large_image",
    title: "GB Tyre Services, Edinburgh",
    description:
      "Same-day tyre fitting, puncture repairs and wheel balancing on Pennywell Road.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#101319",
  colorScheme: "dark",
};

/** Structured data so the shop shows correctly in local search results. */
const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  name: business.name,
  image: "https://gbtyreservices.co.uk/logo.png",
  telephone: business.phone,
  email: business.email,
  url: "https://gbtyreservices.co.uk",
  address: {
    "@type": "PostalAddress",
    streetAddress: business.street,
    addressLocality: business.city,
    postalCode: business.postcode,
    addressCountry: "GB",
  },
  openingHoursSpecification: openingHours
    .filter((slot) => slot.opens)
    .map((slot) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek:
        slot.days === "Saturday"
          ? ["Saturday"]
          : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: slot.opens,
      closes: slot.closes,
    })),
  areaServed: "Edinburgh and the Lothians",
  description: `Tyre shop at ${fullAddress}. ${services
    .map((service) => service.title)
    .join(", ")}.`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`${archivo.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="grain min-h-full">
        <script
          type="application/ld+json"
          // Static, author-controlled object. No user input reaches this string.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd),
          }}
        />
        {children}
      </body>
    </html>
  );
}
