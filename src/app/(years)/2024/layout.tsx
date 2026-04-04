import type { Metadata } from "next";

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
    // data-year scopes CSS variables and Tailwind variants to this year's theme
    <div data-year="2024" className="year-page-enter">
      {children}
    </div>
  );
}
