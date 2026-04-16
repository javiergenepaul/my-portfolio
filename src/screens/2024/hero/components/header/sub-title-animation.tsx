"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { translate, useLocaleRefresh } from "@/i18n";
import { secondsToMilliseconds } from "@/lib";

// TypeAnimation does client-only DOM manipulation — skip SSR entirely to
// avoid the server/client content mismatch hydration warning.
const TypeAnimation = dynamic(
  () => import("react-type-animation").then((m) => m.TypeAnimation),
  { ssr: false },
);

export const SubTitleAnimation = () => {
  useLocaleRefresh();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const TYPE_ROLES: string[] = [
    translate("header.typeRole.fullStack"),
    translate("header.typeRole.reactTypescript"),
    translate("header.typeRole.springBoot"),
    translate("header.typeRole.uiuxAdvocate"),
    translate("header.typeRole.uiLibraryEnthusiasts"),
  ];

  return (
    <h2 className="mt-3 text-lg font-medium tracking-tight select-none sm:text-xl">
      {mounted ? (
        <TypeAnimation
          sequence={TYPE_ROLES.reduce<(string | number)[]>((acc, role) => {
            acc.push(role);
            acc.push(secondsToMilliseconds(3));
            return acc;
          }, [])}
          wrapper="span"
          speed={50}
          repeat={Infinity}
        />
      ) : (
        <span>{TYPE_ROLES[0]}</span>
      )}
    </h2>
  );
};
