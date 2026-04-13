import type { Metadata } from "next";
import { About2024 } from "@/components/2024/about";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn more about Gene Paul Mar Javier — a full-stack software engineer passionate about building scalable web applications.",
  alternates: { canonical: "/2024/about" },
  openGraph: {
    title: "About — Gene Paul Mar Javier",
    description:
      "Learn more about Gene Paul Mar Javier — a full-stack software engineer passionate about building scalable web applications.",
    url: "https://genepaulmarjavier.dev/2024/about",
  },
};

export default function AboutPage() {
  return <About2024 />;
}
