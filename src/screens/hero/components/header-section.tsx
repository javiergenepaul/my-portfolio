import { BounceText, NavLinks, SocialButton, ThemeSwitch } from "@/components";
import {
  NAV_LINKS,
  NavLinkInterface,
  SOCIAL_MEDIA_LINKS,
  SocialMediaLinksInterface,
} from "@/config";
import { SubTitleAnimation } from "./sub-title-animation";
import { useThemeStore } from "@/stores";
import { AboutMeAvatar } from "@/screens";

export const HeaderSection = () => {
  const { setDarkMode, darkMode } = useThemeStore();
  return (
    <>
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-200 sm:text-5xl">
          <BounceText text="Gene Paul Mar Javier" />
        </h1>
        <SubTitleAnimation />
        <p className="mt-4 leading-normal text-white">
          As a Fullstack Developer, I'm Committed to Crafting Exceptional
          Digital Experiences: Building Pixel-Perfect, Engaging, and Accessible
          Websites with Precision and Care, Leveraging Robust APIs for Seamless
          Functionality
        </p>
        <nav className="nav hidden lg:block" aria-label="Navigation Links">
          <ul className="mt-16 w-max">
            {NAV_LINKS.map((nav: NavLinkInterface) => (
              <NavLinks key={nav.key} name={nav.name} path={nav.path} />
            ))}
          </ul>
        </nav>
      </div>

      <ul
        className="ml-1 mt-8 gap-3 flex items-center"
        aria-label="Social Media"
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
          checked={darkMode}
          onChange={(e) => setDarkMode(e.target.checked)}
        />
      </ul>
    </>
  );
};
