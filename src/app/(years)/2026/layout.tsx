import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gene Paul Mar Javier — 2026 Portfolio",
  description: "Coming soon — 2026 edition of Gene Paul Mar Javier's portfolio.",
  icons: {
    icon: "/favicons/2026.ico",
  },
};

export default function Layout2026({ children }: { children: React.ReactNode }) {
  return (
    <div data-year="2026" className="year-page-enter">
      {children}
    </div>
  );
}
