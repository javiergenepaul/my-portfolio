import type { Metadata } from "next";
import { Confidential2024 } from "@/components/2024/confidential";

export const metadata: Metadata = {
  title: "Confidential — 2024",
  robots: { index: false, follow: false },
};

export default function ConfidentialPage() {
  return <Confidential2024 />;
}
