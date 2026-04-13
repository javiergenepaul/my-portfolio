"use client";

import { useLocaleRefresh } from "@/i18n";
import { Separator } from ".";

interface PageTitleInterface {
  pageName: string;
  description: string;
  path: string;
}

export const PageTitle = ({ pageName, description }: PageTitleInterface) => {
  useLocaleRefresh();
  return (
    <>
      <div className="space-y-0.5">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {pageName}
        </h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <Separator className="my-6" />
    </>
  );
};
