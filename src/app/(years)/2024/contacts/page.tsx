import type { Metadata } from "next";
import { getServerProfile } from "@/lib/content/server-profile";
import { Contact2024 } from "@/components/2024/contact";

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getServerProfile();
  const n = profile.fullName;
  const DESCRIPTION = `Get in touch with ${n} — open to freelance, collaboration, and job opportunities.`;

  return {
    title: "Contact",
    description: DESCRIPTION,
    alternates: { canonical: "/2024/contacts" },
    openGraph: {
      title: `Contact — ${n}`,
      description: DESCRIPTION,
      url: "https://genepaulmarjavier.dev/2024/contacts",
    },
  };
}

export default function ContactPage() {
  return <Contact2024 />;
}
