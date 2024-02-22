import { BounceText, NavLinks } from "@/components";
import SocialButton from "@/components/ui/social-button";
import {
  NAV_LINKS,
  NavLinkInterface,
  SOCIAL_MEDIA_LINKS,
  SocialMediaLinksInterface,
} from "@/config";

export const HeaderSection = () => {
  return (
    <>
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-200 sm:text-5xl">
          <BounceText text="Gene Paul Mar Javier" />
        </h1>
        <h2 className="mt-3 text-lg font-medium tracking-tight text-slate-200 sm:text-xl">
          Software Developer
        </h2>
        <p className="mt-4 max-w-xs leading-normal text-white">
          I build pixel-perfect, engaging, and accessible digital experiences.
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
      </ul>
    </>
  );
};
