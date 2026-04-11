import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gene Paul Mar Javier — 2025 Portfolio",
  description: "2025 portfolio of Gene Paul Mar Javier — Moonlight Red edition.",
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
