import { Label, RadioGroup } from "@/components";
import { AppleIcon } from "lucide-react";
import { SidebarLangOptions } from "./sidebar-lang-option";
import { useTranslation } from "react-i18next";
import { DEFAULT_LANGUAGE, LanguageType, useLanguageStore } from "@/stores";
import { translate } from "@/i18n";

export const SidebarLangBtn = () => {
  const { i18n } = useTranslation();
  const { language, setLanguage } = useLanguageStore();

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
        <SidebarLangOptions
          value={"en"}
          name={translate("sidebar.languageOption.english")}
          icon={<AppleIcon />}
        />
        <SidebarLangOptions
          value={"ja"}
          name={translate("sidebar.languageOption.japanese")}
          icon={<AppleIcon />}
        />
        <SidebarLangOptions
          value={"ceb"}
          name={translate("sidebar.languageOption.cebuano")}
          icon={<AppleIcon />}
        />
        <SidebarLangOptions
          value={"fil"}
          name={translate("sidebar.languageOption.tagalog")}
          icon={<AppleIcon />}
        />
      </RadioGroup>
    </div>
  );
};
