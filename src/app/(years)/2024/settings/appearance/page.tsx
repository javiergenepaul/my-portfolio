import type { Metadata } from "next";
import { SettingsAppearance2024 } from "@/components/2024/settings-appearance";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Appearance — Settings — 2024",
};

export default function SettingsAppearancePage() {
  return <SettingsAppearance2024 />;
}
