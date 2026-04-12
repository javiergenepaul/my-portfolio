"use client";

import { useRouter } from "next/navigation";
import { triggerNavigationStart } from "@/components/navigation/NavigationProgress";
import { Avatar, AvatarFallback, AvatarImage, Button } from "@/components";
import { Banner } from "../../components";
import { AvatarProfile } from "@/assets";
import { translate } from "@/i18n";
import { PATH } from "@/config";

export const OutroSection = () => {
  const router = useRouter();

  return (
    <section className="relative pb-16">
      <Banner />
      <div className="flex justify-center py-16 pb-8">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-62.5 w-62.5">
            <AvatarImage
              className="rounded-full border-primary border-4"
              src={AvatarProfile as unknown as string}
            />
            <AvatarFallback className="rounded-full border-primary border-4">
              {translate("header.shortName")}
            </AvatarFallback>
          </Avatar>
          <h1 className="lg:text-5xl text-center text-2xl font-semibold">
            {translate("about.outro.workTogether")}
          </h1>
          <p className="text-muted-foreground text-sm max-w-175 text-center">
            {translate("about.outro.sub")}
          </p>
          <Button
            className="w-fit"
            onClick={() => {
              triggerNavigationStart();
              router.push(PATH.CONTACTS.path);
            }}
          >
            {translate("about.outro.getInTouch")}
          </Button>
        </div>
      </div>
    </section>
  );
};
