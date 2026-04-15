"use client";

import { Mail, GithubIcon, LinkedinIcon, ExternalLink } from "lucide-react";
import { EMAIL_ADDRESS } from "@/config";
import { GITHUB_URL, LINKED_IN_URL } from "@/config/url";
import { translate, useLocaleRefresh } from "@/i18n";

export function ContactContent() {
  useLocaleRefresh();
  const links = [
    {
      label: "Email",
      value: EMAIL_ADDRESS,
      href: `mailto:${EMAIL_ADDRESS}`,
      icon: <Mail size={18} />,
      color: "var(--a26-teal)",
      desc: translate("win26.contact.emailDesc"),
    },
    {
      label: "GitHub",
      value: "javiergenepaul",
      href: GITHUB_URL,
      icon: <GithubIcon size={18} />,
      color: "var(--a26-text)",
      desc: translate("win26.contact.githubDesc"),
    },
    {
      label: "LinkedIn",
      value: "gene-paul-mar-javier",
      href: LINKED_IN_URL,
      icon: <LinkedinIcon size={18} />,
      color: "#60A5FA",
      desc: translate("win26.contact.linkedinDesc"),
    },
  ];

  return (
    <div className="font-mac flex flex-col py-7 px-8 gap-3.5">
      <div className="mb-1">
        <h2 className="text-a26-text text-lg font-bold m-0">
          {translate("win26.contact.title")}
        </h2>
        <p className="text-a26-mid text-[13px] mt-1 m-0">
          {translate("win26.contact.subtitle")}
        </p>
      </div>

      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3.5 bg-a26-card border border-a26-card-border rounded-[10px] py-3.5 px-4.5 no-underline transition-[border-color] duration-150"
          onMouseEnter={(e) =>
            (e.currentTarget.style.borderColor = `color-mix(in srgb, ${l.color} 35%, transparent)`)
          }
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}
        >
          <div
            className="flex items-center justify-center shrink-0 w-10.5 h-10.5 rounded-[10px]"
            style={{
              background: `color-mix(in srgb, ${l.color} 10%, transparent)`,
              color: l.color,
            }}
          >
            {l.icon}
          </div>

          <div className="flex-1">
            <div className="text-a26-text text-[13px] font-semibold">
              {l.label}
            </div>
            <div className="text-xs mt-px" style={{ color: l.color }}>
              {l.value}
            </div>
            <div className="text-a26-muted text-[11px] mt-px">{l.desc}</div>
          </div>

          <ExternalLink size={14} color="var(--a26-text-muted)" />
        </a>
      ))}
    </div>
  );
}
