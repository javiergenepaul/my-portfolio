import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gene Paul Mar Javier — 2025 Portfolio",
  description: "Coming soon — 2025 edition of Gene Paul Mar Javier's portfolio.",
  icons: {
    icon: "/favicons/2025.ico",
  },
};

export default function Layout2025({ children }: { children: React.ReactNode }) {
  return (
    <div data-year="2025" className="year-page-enter">
      {children}
    </div>
  );
}
