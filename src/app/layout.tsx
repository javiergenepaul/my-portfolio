import type { Metadata } from "next";
import { Inter, Poppins, Work_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";

// ─── Font definitions (replaces typeface-* npm packages) ─────────────────────
// Variable names use a distinct suffix (-variable) to avoid circular reference
// when Tailwind v4 @theme maps --font-inter → var(--font-inter-variable).
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter-variable",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins-variable",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans-variable",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Gene Paul Mar Javier",
    default: "Gene Paul Mar Javier — Full-Stack Engineer",
  },
  description:
    "Full-stack software engineer specializing in React, Spring Boot, and modern web technologies.",
  metadataBase: new URL("https://javiergenepaul.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Gene Paul Mar Javier Portfolio",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      // Class is hydrated client-side by ThemeProvider (e.g. "dark emerald")
      suppressHydrationWarning
    >
      <body
        className={`${inter.variable} ${poppins.variable} ${workSans.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
