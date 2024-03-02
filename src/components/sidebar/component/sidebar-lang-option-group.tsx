import { Label, RadioGroup } from "@/components";
import { SidebarLangOptions } from "./sidebar-lang-option";
import { useTranslation } from "react-i18next";
import { DEFAULT_LANGUAGE, LanguageType, useLanguageStore } from "@/stores";
import { translate } from "@/i18n";
import { JPFlag, PHFlag, USFlag } from "@/assets";

export const SidebarLangOptionGroup = () => {
  const { i18n } = useTranslation();
  const { language, setLanguage } = useLanguageStore();

  const LANGUAGE_OPTIONS: SidebarLangOptions[] = [
    {
      value: "en",
      name: translate("sidebar.languageOption.english"),
      icon: <img src={USFlag} />,
    },
    {
      value: "ja",
      name: translate("sidebar.languageOption.japanese"),
      icon: <img src={JPFlag} />,
    },
    {
      value: "fil",
      name: translate("sidebar.languageOption.tagalog"),
      icon: <img src={PHFlag} />,
    },
    {
      value: "ceb",
      name: translate("sidebar.languageOption.cebuano"),
      icon: <img src={PHFlag} />,
    },
  ];

  return (
    <div className="space-y-2">
      <Label>{translate("sidebar.changeLanguage")}</Label>
      <RadioGroup
        defaultValue={DEFAULT_LANGUAGE}
        value={language}
        onValueChange={(value: LanguageType) => {
          setLanguage(value);
          i18n.changeLanguage(value);
        }}
        className="grid grid-cols-2 gap-4"
      >
        {LANGUAGE_OPTIONS.map((lang: SidebarLangOptions, index: React.Key) => {
          return <SidebarLangOptions key={index} {...lang} />;
        })}
      </RadioGroup>
    </div>
  );
};
