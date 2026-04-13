import type { Metadata } from "next";
import { Contact2024 } from "@/components/2024/contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Gene Paul Mar Javier — open to freelance, collaboration, and job opportunities.",
  alternates: { canonical: "/2024/contacts" },
  openGraph: {
    title: "Contact — Gene Paul Mar Javier",
    description:
      "Get in touch with Gene Paul Mar Javier — open to freelance, collaboration, and job opportunities.",
    url: "https://genepaulmarjavier.dev/2024/contacts",
  },
};

export default function ContactPage() {
  return <Contact2024 />;
}
