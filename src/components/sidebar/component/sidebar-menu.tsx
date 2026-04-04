"use client";

import Link from "next/link";
import { SideMenuInterface } from "@/config";
import { useSiderStore } from "@/stores";
import { Separator } from "@radix-ui/react-separator";

export const SidebarMenu = ({ path, name, icon, href }: SideMenuInterface) => {
  const { setIsOpen } = useSiderStore();

  return href ? (
    <>
      <a
        href={href}
        className="flex items-center gap-4 py-1.5"
        onClick={() => setIsOpen(false)}
      >
        {icon}
        {name}
      </a>
      <Separator className="my-2" />
    </>
  ) : (
    <>
      <Link
        href={path}
        className="flex items-center gap-4 py-1.5"
        onClick={() => setIsOpen(false)}
      >
        {icon}
        {name}
      </Link>
      <Separator className="my-2" />
    </>
  );
};
