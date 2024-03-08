import { translate } from "@/i18n";
import { secondsToMilliseconds } from "@/lib";
import { useTranslation } from "react-i18next";
import { TypeAnimation } from "react-type-animation";

export const SubTitleAnimation = () => {
  const {} = useTranslation();

  const TYPE_ROLES: string[] = [
    translate("header.typeRole.fullStack"),
    translate("header.typeRole.reactTypescript"),
    translate("header.typeRole.springBoot"),
    translate("header.typeRole.uiuxAdvocate"),
    translate("header.typeRole.uiLibraryEnthusiasts"),
  ];

  return (
    <TypeAnimation
      sequence={TYPE_ROLES.reduce<(string | number)[]>((acc, role) => {
        acc.push(role);
        acc.push(secondsToMilliseconds(3));
        return acc;
      }, [])}
      wrapper="h2"
      speed={50}
      className="mt-3 text-lg font-medium tracking-tight select-none sm:text-xl"
      repeat={Infinity}
    />
  );
};
