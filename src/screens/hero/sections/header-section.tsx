import {
  BounceText,
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components";
import {
  GITHUB_URL,
  LINKED_IN_URL,
  NAV_LINKS,
  PATH,
  UPWORK_URL,
} from "@/config";
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
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Settings } from "lucide-react";

export const HeaderSection = () => {
  const navigate = useNavigate();
  const {} = useTranslation();

  const SOCIAL_MEDIA_LINKS: SocialMediaLinksInterface[] = [
    {
      key: "github",
      icon: "github",
      title: translate("header.socialMediaLinks.github"),
      url: GITHUB_URL,
    },
    {
      key: "linkedIn",
      icon: "linkedin",
      title: translate("header.socialMediaLinks.linkedIn"),
      url: LINKED_IN_URL,
    },
    {
      key: "upwork",
      icon: "upwork",
      title: translate("header.socialMediaLinks.upwork"),
      url: UPWORK_URL,
    },
  ];

  return (
    <>
      <section className="flex flex-col justify-between h-full">
        <div>
          <Link className="focus:outline-none" to={PATH.ABOUT.path}>
            <h1 className="block text-5xl font-bold tracking-tight lg:hidden selec-none">
              {translate("header.name")}
            </h1>
            <h1 className="hidden font-bold tracking-tight select-none md:text-5xl lg:block">
              <BounceText
                className="font-bold outline-none ring-0 focus:outline-none"
                text={translate("header.name")}
              />
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
              onClick={() => {
                navigate(PATH.CONTACTS.path);
              }}
            >
              {translate("getInTouch")}
            </Button>
            <Link to={PATH.ABOUT.path}>
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
              )
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Link className="hidden lg:block" to={PATH.SETTINGS.path}>
                    <Settings />
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
