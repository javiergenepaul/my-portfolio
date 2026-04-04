import type { Metadata } from "next";
import { About2024 } from "@/components/portfolio-2024/about";

export const metadata: Metadata = {
  title: "About — 2024",
};

export default function AboutPage() {
  return <About2024 />;
}
