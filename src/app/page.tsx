import type { Metadata } from "next";
import { RootLanding } from "@/components/common/root-landing";

const BASE_URL = "https://gene-paul-mar-javier.dev";
const TITLE = "Gene Paul Mar Javier — Full-Stack Software Engineer";
const DESCRIPTION =
  "Gene Paul Mar Javier is a full-stack software engineer from Cebu, Philippines, building web apps with React, Next.js, Spring Boot, TypeScript, and Java.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: BASE_URL,
  },
  twitter: {
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootPage() {
  return <RootLanding />;
}
