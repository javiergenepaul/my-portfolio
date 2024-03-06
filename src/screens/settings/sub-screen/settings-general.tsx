import { i18n, translate } from "@/i18n";
import {
  GeneralLangOption,
  GeneralLangOptions,
  InpuptFieldGroup,
} from "../components";
import { JPFlag, PHFlag, USFlag } from "@/assets";
import { LanguageType, useLanguageStore, useSettingsStore } from "@/stores";
import {
  Label,
  RadioGroup,
  Switch,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useToast,
} from "@/components";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useId } from "react";

export const SettingsGeneral = () => {
  const { setLanguage, language } = useLanguageStore();
  const {
    enableParticleBackground,
    sidenavSwipeToggle,
    setEnableParticleBackground,
    setSideNavSwipeToggle,
  } = useSettingsStore();
  const { toast } = useToast();

  const particleSwitchId = useId();
  const sideNavToggleSwitch = useId();

  const LANGUAGE_OPTIONS: GeneralLangOptions[] = [
    {
      value: "en",
      name: translate("sidebar.languageOption.english"),
      icon: <img width={"170px"} height={"80px"} src={USFlag} />,
    },
    {
      value: "ja",
      name: translate("sidebar.languageOption.japanese"),
      icon: <img width={"170px"} height={"80px"} src={JPFlag} />,
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
      title: translate("settings.settingsUpdated"),
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

  const onChangeParticleBackground = (value: boolean) => {
    setEnableParticleBackground(value);
    toast({
      variant: "success",
      duration: 3000,
      title: translate("settings.settingsUpdated"),
      description: translate("settings.particle.toast.success", {
        enabledParticle: value
          ? translate("settings.particle.enabled")
          : translate("settings.particle.disabled"),
      }),
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        {/* Particle Background Switch Field */}
        <div className="flex gap-4 items-center py-2.5">
          <Switch
            checked={enableParticleBackground}
            onCheckedChange={onChangeParticleBackground}
            id={particleSwitchId}
          />
          <Label
            className="cursor-pointer flex gap-2 items-center"
            htmlFor={particleSwitchId}
          >
            {translate("settings.particle.formDescription")}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoCircledIcon height={"1.2rem"} width={"1.2rem"} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{translate("settings.particle.tooltip")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
        </div>

        {/* Side Nav Side Toggle Switch Field */}
        <div className="flex gap-4 items-center py-2.5">
          <Switch
            checked={sidenavSwipeToggle}
            onCheckedChange={setSideNavSwipeToggle}
            id={sideNavToggleSwitch}
          />
          <Label
            className="cursor-pointer flex gap-2 items-center"
            htmlFor={sideNavToggleSwitch}
          >
            Sidenav Swipe Open
            {/* {translate("settings.particle.formDescription")} */}
          </Label>
        </div>
      </div>

      {/* Language Fields */}
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
    </div>
  );
};
