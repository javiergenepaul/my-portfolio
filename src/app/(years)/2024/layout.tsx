import type { Metadata } from "next";
import { Layout2024Client } from "./layout-client";

export const metadata: Metadata = {
  title: "Gene Paul Mar Javier — 2024 Portfolio",
  description:
    "Full-stack software engineer portfolio for 2024. Featuring projects, skills, and experience in React, Spring Boot, and modern web technologies.",
  icons: {
    icon: "/favicons/2024.ico",
    apple: "/favicons/2024-apple.png",
  },
  openGraph: {
    title: "Gene Paul Mar Javier — 2024 Portfolio",
    description:
      "Full-stack software engineer portfolio for 2024.",
    images: [{ url: "/og/2024.png", width: 1200, height: 630 }],
  },
};

export default function Layout2024({ children }: { children: React.ReactNode }) {
  return (
    // Layout2024Client (FloatingNavigation, BackgroundParticle) must be a
    // sibling of data-year — NOT nested inside it. The year-page-enter
    // animation uses transform, which creates a new containing block and
    // would trap position:fixed children (breaking FloatingNavigation).
    <Layout2024Client>
      <div data-year="2024" className="year-page-enter">
        {children}
      </div>
    </Layout2024Client>
  );
}
