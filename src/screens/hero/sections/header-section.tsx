import { BounceText, ThemeSwitch } from "@/components";
import {
  NAV_LINKS,
  NavLinkInterface,
  PATH,
  SOCIAL_MEDIA_LINKS,
  SocialMediaLinksInterface,
} from "@/config";
import { translate } from "@/i18n";
import { useThemeStore } from "@/stores";
import React from "react";
import {
  AboutMeAvatar,
  NavLinks,
  SocialButton,
  SubTitleAnimation,
} from "../components";
import { Link } from "react-router-dom";

export const HeaderSection = () => {
  const { getTheme, toggleTheme } = useThemeStore();

  return (
    <>
      <section>
        <Link to={PATH.ABOUT.path}>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            <BounceText text={translate("header.name")} />
          </h1>
        </Link>
        <SubTitleAnimation />
        <p className="mt-4 leading-normal">{translate("header.description")}</p>
        <nav
          className="hidden nav lg:block"
          aria-label={translate("header.ariaLabel.navigationLinks")}
        >
          <ul className="mt-16 w-max">
            {NAV_LINKS.map((nav: NavLinkInterface) => (
              <React.Fragment key={nav.key}>
                <NavLinks
                  key={nav.key}
                  name={nav.name}
                  path={nav.path}
                  selectedId={nav.selectedId}
                />
              </React.Fragment>
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
