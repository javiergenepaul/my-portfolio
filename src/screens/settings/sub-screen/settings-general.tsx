import { i18n, translate } from "@/i18n";
import {
  GeneralLangOption,
  GeneralLangOptions,
  InpuptFieldGroup,
} from "../components";
import { PHFlag, USFlag } from "@/assets";
import { LanguageType, useLanguageStore } from "@/stores";
import { RadioGroup, useToast } from "@/components";

export const SettingsGeneral = () => {
  const { setLanguage, language } = useLanguageStore();
  const { toast } = useToast();

  const LANGUAGE_OPTIONS: GeneralLangOptions[] = [
    {
      value: "en",
      name: translate("sidebar.languageOption.english"),
      icon: <img width={"170px"} height={"80px"} src={USFlag} />,
    },
    {
      value: "ja",
      name: translate("sidebar.languageOption.japanese"),
      icon: <img width={"170px"} height={"80px"} src={USFlag} />,
    },
    {
      value: "fil",
      name: translate("sidebar.languageOption.tagalog"),
      icon: <img width={"170px"} height={"80px"} src={PHFlag} />,
    },
    {
      value: "ceb",
      name: translate("sidebar.languageOption.cebuano"),
      icon: <img width={"170px"} height={"80px"} src={PHFlag} />,
    },
  ];

  const onChangeLangHanlder = (value: LanguageType) => {
    setLanguage(value);
    i18n.changeLanguage(value);

    toast({
      variant: "success",
      duration: 3000,
      title: "Settings Updated",
      description: translate("settings.lang.toast.success.general", {
        language: getLanguageName(value),
      }),
    });
  };

  const getLanguageName = (lang: LanguageType): string => {
    switch (lang) {
      case "en":
        return "English";
      case "ja":
        return "Japanese";
      case "fil":
        return "Tagalog";
      case "ceb":
        return "Cebuano";
      default:
        return "English";
    }
  };

  return (
    <>
      <InpuptFieldGroup
        label={translate("settings.lang.lang")}
        description={translate("settings.lang.formDescription")}
      >
        <RadioGroup
          value={language}
          defaultValue="en"
          onValueChange={onChangeLangHanlder}
          className="grid grid-cols-4 gap-4"
        >
          {LANGUAGE_OPTIONS.map(
            (lang: GeneralLangOptions, index: React.Key) => {
              return <GeneralLangOption key={index} {...lang} />;
            }
          )}
        </RadioGroup>
      </InpuptFieldGroup>
    </>
  );
};
