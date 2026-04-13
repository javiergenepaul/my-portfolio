import type { Metadata } from "next";
import { Settings2024 } from "@/components/2024/settings";

export const metadata: Metadata = {
  title: "Settings — 2024",
};

export default function SettingsPage() {
  return <Settings2024 />;
}
