"use client";

import Link from "next/link";
import { SideMenuInterface } from "@/config";
import { useSiderStore } from "@/stores";
import { Separator } from "@radix-ui/react-separator";

export const SidebarMenu = ({
  path,
  name,
  icon,
  href,
  onClick,
}: SideMenuInterface) => {
  const { setIsOpen } = useSiderStore();

  const handleClick = () => {
    setIsOpen(false);
    onClick?.();
  };

  return (
    <>
      {onClick ? (
        <button
          className="flex items-center gap-4 py-1.5 w-full text-left"
          onClick={handleClick}
        >
          {icon}
          {name}
        </button>
      ) : href ? (
        <a
          href={href}
          className="flex items-center gap-4 py-1.5"
          onClick={handleClick}
        >
          {icon}
          {name}
        </a>
      ) : (
        <Link
          href={path}
          className="flex items-center gap-4 py-1.5"
          onClick={handleClick}
        >
          {icon}
          {name}
        </Link>
      )}
      <Separator className="my-2" />
    </>
  );
};
