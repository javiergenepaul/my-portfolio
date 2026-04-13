"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib";
import { SettingsItemInterface } from "../settings";
import { buttonVariants } from "@/components";
import { PATH } from "@/config";

interface SettingsSidenavProps {
  items: SettingsItemInterface[];
  className?: string;
}

export const SettingsSidenav = ({ items, className }: SettingsSidenavProps) => {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex flex-wrap gap-1 lg:flex-col lg:flex-nowrap lg:gap-0 lg:space-y-1",
        className,
      )}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.href ||
              (pathname.endsWith("/") && item.href === PATH.SETTINGS.path)
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start",
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
};
