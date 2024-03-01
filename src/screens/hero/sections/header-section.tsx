import { BounceText, Button } from "@/components";
import { NAV_LINKS, PATH, SOCIAL_MEDIA_LINKS } from "@/config";
import { translate } from "@/i18n";
import { useThemeStore } from "@/stores";
import React from "react";
import {
  AboutMeAvatar,
  NavLinkInterface,
  NavLinks,
  SocialButton,
  SocialMediaLinksInterface,
  SubTitleAnimation,
  ThemeSwitch,
} from "../components";
import { Link } from "react-router-dom";
import { ResumeDark, ResumeLight } from "../../../assets";

export const HeaderSection = () => {
  const { getTheme, toggleTheme } = useThemeStore();

  const downloadResumeHandler = () => {
    getTheme;
    if (getTheme()) {
      window.open(ResumeDark, "_blank");
    } else {
      window.open(ResumeLight, "_blank");
    }
  };

  return (
    <>
      <section>
        <Link className="focus:outline-none" to={PATH.ABOUT.path}>
          <h1 className="text-4xl font-bold tracking-tight select-none sm:text-5xl">
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
        <div className="flex gap-4 mt-8 select-none">
          <Button variant={"default"} onClick={downloadResumeHandler}>
            {translate("resume.btnName")}
          </Button>
          <Link to={PATH.ABOUT.path}>
            <Button variant={"link"}>{translate("moreInfo")}</Button>
          </Link>
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
      </section>
      <ul
        className="flex items-center gap-3 mt-8 ml-1"
        aria-label={translate("header.ariaLabel.socialMedia")}
      >
        {SOCIAL_MEDIA_LINKS.map((socialMedia: SocialMediaLinksInterface) => (
          <SocialButton
            key={socialMedia.key}
            title={socialMedia.title}
            url={socialMedia.url}
            icon={socialMedia.icon}
          />
        ))}
        <AboutMeAvatar />
        <ThemeSwitch
          checked={getTheme()}
          onChange={(e) => toggleTheme(e.target.checked)}
        />
      </ul>
    </>
  );
};
