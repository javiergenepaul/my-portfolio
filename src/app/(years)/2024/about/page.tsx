import type { Metadata } from "next";
import { getServerProfile } from "@/lib/content/server-profile";
import { About2024 } from "@/components/2024/about";

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getServerProfile();
  const n = profile.fullName;
  const DESCRIPTION = `Learn more about ${n} — a full-stack software engineer passionate about building scalable web applications.`;

  return {
    title: "About",
    description: DESCRIPTION,
    alternates: { canonical: "/2024/about" },
    openGraph: {
      title: `About — ${n}`,
      description: DESCRIPTION,
      url: "https://genepaulmarjavier.dev/2024/about",
    },
  };
}

export default function AboutPage() {
  return <About2024 />;
}
