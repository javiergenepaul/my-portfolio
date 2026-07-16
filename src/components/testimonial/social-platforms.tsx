import {
  Linkedin,
  Github,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Dribbble,
  Globe,
  type LucideIcon,
} from "lucide-react";

export interface SocialPlatform {
  value: string;
  label: string;
  icon: LucideIcon;
  placeholder: string;
}

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    value: "linkedin",
    label: "LinkedIn",
    icon: Linkedin,
    placeholder: "https://linkedin.com/in/…",
  },
  {
    value: "github",
    label: "GitHub",
    icon: Github,
    placeholder: "https://github.com/…",
  },
  {
    value: "x",
    label: "X (Twitter)",
    icon: Twitter,
    placeholder: "https://x.com/…",
  },
  {
    value: "facebook",
    label: "Facebook",
    icon: Facebook,
    placeholder: "https://facebook.com/…",
  },
  {
    value: "instagram",
    label: "Instagram",
    icon: Instagram,
    placeholder: "https://instagram.com/…",
  },
  {
    value: "behance",
    label: "Behance",
    icon: Globe,
    placeholder: "https://behance.net/…",
  },
  {
    value: "dribbble",
    label: "Dribbble",
    icon: Dribbble,
    placeholder: "https://dribbble.com/…",
  },
  {
    value: "youtube",
    label: "YouTube",
    icon: Youtube,
    placeholder: "https://youtube.com/@…",
  },
  { value: "website", label: "Website", icon: Globe, placeholder: "https://…" },
];

export function getPlatform(value: string): SocialPlatform | undefined {
  return SOCIAL_PLATFORMS.find((p) => p.value === value);
}

export interface SocialLink {
  platform: string;
  url: string;
}
