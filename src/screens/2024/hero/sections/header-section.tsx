import {
  BounceText,
  Button,
  SocialIcon,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components";
import { GITHUB_URL, LINKED_IN_URL, PATH } from "@/config";
import { translate } from "@/i18n";
import React from "react";
import {
  AboutMeAvatar,
  NavLinkInterface,
  NavLinks,
  SocialButton,
  SocialMediaLinksInterface,
  SubTitleAnimation,
} from "../components";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocaleRefresh } from "@/i18n";
import { useSettingsStore } from "@/stores";
import { twMerge } from "tailwind-merge";
import { useState } from "react";

import { triggerNavigationStart } from "@/components/common/navigation/NavigationProgress";

// Static parts only — translate() must NOT be called at module scope because
// messageStore is empty during SSR. Titles are resolved inside the component.
const SOCIAL_MEDIA_LINK_DATA = [
  { key: "github", icon: "github", url: GITHUB_URL },
  { key: "linkedIn", icon: "linkedin", url: LINKED_IN_URL },
] as const;

export const HeaderSection = () => {
  const router = useRouter();
  useLocaleRefresh();
  const { isSettingsNew, setIsSettingsNew } = useSettingsStore();
  const [navigating, setNavigating] = useState(false);

  // Resolved here so translate() runs after messageStore is initialised
  const SOCIAL_MEDIA_LINKS: SocialMediaLinksInterface[] =
    SOCIAL_MEDIA_LINK_DATA.map((item) => ({
      ...item,
      title: translate(`header.socialMediaLinks.${item.key}`),
    }));

  const NAV_LINKS: NavLinkInterface[] = [
    {
      name: translate("header.navLinks.services"),
      path: "#services",
      selectedId: "services",
    },
    {
      name: translate("header.navLinks.projects"),
      path: "#projects",
      selectedId: "projects",
    },
    {
      name: translate("header.navLinks.contacts"),
      path: "#contacts",
      selectedId: "contacts",
    },
  ];

  return (
    <>
      <section className="flex flex-col justify-between h-full">
        <div>
          <Link className="focus:outline-none" href={PATH.ABOUT.path}>
            <h1 className="font-bold tracking-tight select-none text-5xl md:text-5xl">
              <span className="block lg:hidden">{translate("header.name")}</span>
              <span className="hidden lg:block">
                <BounceText
                  className="font-bold outline-none ring-0 focus:outline-none"
                  text={translate("header.name")}
                />
              </span>
            </h1>
          </Link>
          <SubTitleAnimation />
          <p className="mt-4 leading-normal select-none">
            {translate("header.description")}
          </p>
        </div>

        <nav
          className="hidden nav lg:block"
          aria-label={translate("header.ariaLabel.navigationLinks")}
        >
          <ul className="mt-12 w-max">
            {NAV_LINKS.map((nav: NavLinkInterface, index: React.Key) => (
              <NavLinks
                key={index}
                name={nav.name}
                path={nav.path}
                selectedId={nav.selectedId}
              />
            ))}
          </ul>
        </nav>
        <div>
          <div className="flex flex-col gap-4 mt-8 select-none lg:flex-row">
            <Button
              className="w-fit"
              variant={"default"}
              disabled={navigating}
              onClick={() => {
                setNavigating(true);
                triggerNavigationStart();
                router.push(PATH.CONTACTS.path);
              }}
            >
              {translate("getInTouch")}
            </Button>
            <Link href={PATH.ABOUT.path}>
              <Button variant={"link"}>{translate("learnMore")}</Button>
            </Link>
          </div>
          <ul
            className="flex items-center gap-4 mt-8 ml-1"
            aria-label={translate("header.ariaLabel.socialMedia")}
          >
            {SOCIAL_MEDIA_LINKS.map(
              (socialMedia: SocialMediaLinksInterface) => (
                <SocialButton
                  key={socialMedia.key}
                  title={socialMedia.title}
                  url={socialMedia.url}
                  icon={socialMedia.icon}
                />
              ),
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Link
                    onClick={() => setIsSettingsNew(true)}
                    className="hidden lg:block hover:text-primary"
                    href={PATH.SETTINGS.path}
                  >
                    <div className="relative">
                      <div
                        className={twMerge(
                          "absolute -top-1 -right-0.75",
                          isSettingsNew ? "hidden" : "",
                        )}
                      >
                        <span className="relative flex w-2.5 h-2.5">
                          <span className="absolute inline-flex w-full h-full bg-red-500 rounded-full opacity-75 animate-ping" />
                          <span className="relative inline-flex w-full h-full bg-red-600 rounded-full animate-pulse" />
                        </span>
                      </div>
                      <SocialIcon icon={"settings"} />
                    </div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent className="hidden lg:block">
                  <span>{translate("settings.settings")}</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <AboutMeAvatar />
          </ul>
        </div>
      </section>
    </>
  );
};
