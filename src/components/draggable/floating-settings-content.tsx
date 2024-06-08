import {
  Color,
  LanguageType,
  Theme,
  useLanguageStore,
  useSettingsStore,
} from "@/stores";
import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Label,
  RadioGroup,
  RadioGroupItem,
  Switch,
  toast,
} from "..";
import React from "react";
import { i18n, translate } from "@/i18n";
import { generateColorQoutes, getRandomGeneratedColorQoutes } from "@/lib";
import {
  AppearanceColorOptionsInterface,
  ApperanceThemeOptionInterface,
  GeneralLangOptions,
} from "@/screens";
import { ChevronsUpDown } from "lucide-react";
import { SLP, DLP, LLP } from "@/assets/layout";
import { USFlag, JPFlag, PHFlag } from "@/assets";
import { useTranslation } from "react-i18next";
import {
  AZURE_COLOR,
  EMERALD_COLOR,
  GOLDEN_COLOR,
  LAVENDER_COLOR,
  SCARLET_COLOR,
  SILVER_COLOR,
  SILVER_COLOR_DARK,
  SUNSET_COLOR,
} from "@/config";

const TOAST_DURATION: number = 2000;

interface FloatingSettingContentInterface {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const FloatingSettingsContent = (
  props: FloatingSettingContentInterface
) => {
  const { isOpen, setIsOpen } = props;
  return (
    <div
      className="flex flex-col gap-2 p-4"
      onMouseLeave={() => {
        setIsOpen(false);
      }}
    >
      <Collapsible open={isOpen}>
        <div className="flex items-center justify-between gap-4">
          <span>{translate("floating.quickAccess")}</span>
          <CollapsibleTrigger className="no-drag" asChild>
            <Button
              onClick={() => {
                setIsOpen(!isOpen);
              }}
              variant={"ghost"}
              size={"sm"}
            >
              <ChevronsUpDown className="w-4 h-4" />
              <span className="sr-only">{translate("floating.toggle")}</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="space-y-2">
          <BackgroundSwitchField />
          <ParticleSwitchField />
          <ColorPaletteField />
          <ThemeField />
          <LanguageField />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

// TODO:: change the design
const BackgroundSwitchField = () => {
  const backgroundId = React.useId();
  const { isBackgroundOnly, setIsBackgroundOnly } = useSettingsStore();

  const onChangeBackgroundSwitch = (value: boolean) => {
    setIsBackgroundOnly(value);
    toast({
      variant: "success",
      duration: 3000,
      title: translate("settings.settingsUpdated"),
      description: "You can now enjoy the background only view",
    });
  };
  return (
    <div className="flex items-center gap-2">
      <Switch
        id={backgroundId}
        checked={isBackgroundOnly}
        onCheckedChange={onChangeBackgroundSwitch}
      />
      <Label htmlFor={backgroundId}>
        {translate("floating.backgroundOnlyMode")}
      </Label>
    </div>
  );
};

// TODO:: change the design
const ParticleSwitchField = () => {
  const particleId = React.useId();
  const { enableParticleBackground, setEnableParticleBackground } =
    useSettingsStore();

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
    <div className="flex items-center gap-2">
      <Switch
        id={particleId}
        checked={enableParticleBackground}
        onCheckedChange={onChangeParticleBackground}
      />
      <Label htmlFor={particleId}>
        {translate("floating.disableParticle")}
      </Label>
    </div>
  );
};

// TODO:: change the design
const ColorPaletteField = () => {
  const {} = useTranslation();
  const { color, setColor, getTheme } = useSettingsStore();
  const onChangeColor = (color: Color) => {
    setColor(color);
    const colorSelected: AppearanceColorOptionsInterface | undefined =
      COLOR_PALETTE_AVAILABLE.find((data) => data.value === color);

    if (colorSelected) {
      toast({
        variant: "success",
        duration: TOAST_DURATION,
        title: colorSelected.name,
        description: getRandomGeneratedColorQoutes(colorSelected.qoutes),
      });
    }
  };

  const COLOR_PALETTE_AVAILABLE: AppearanceColorOptionsInterface[] = [
    {
      name: translate("settings.color.options.emerald.title"),
      value: "emerald",
      color: EMERALD_COLOR,
      qoutes: [...generateColorQoutes("emerald")],
    },
    {
      name: translate("settings.color.options.azure.title"),
      value: "azure",
      color: AZURE_COLOR,
      qoutes: [...generateColorQoutes("azure")],
    },
    {
      name: translate("settings.color.options.golden.title"),
      value: "golden",
      color: GOLDEN_COLOR,
      qoutes: [...generateColorQoutes("golden")],
    },
    {
      name: translate("settings.color.options.sunset.title"),
      value: "sunset",
      color: SUNSET_COLOR,
      qoutes: [...generateColorQoutes("sunset")],
    },
    {
      name: translate("settings.color.options.lavender.title"),
      value: "lavender",
      color: LAVENDER_COLOR,
      qoutes: [...generateColorQoutes("lavender")],
    },
    {
      name: translate("settings.color.options.scarlet.title"),
      value: "scarlet",
      color: SCARLET_COLOR,
      qoutes: [...generateColorQoutes("scarlet")],
    },
    {
      name: translate("settings.color.options.silver.title"),
      value: "silver",
      color: getTheme() ? SILVER_COLOR : SILVER_COLOR_DARK,
      qoutes: [...generateColorQoutes("silver")],
    },
  ];

  return (
    <div className="">
      <Label>{translate("floating.colorPalette")}</Label>
      <RadioGroup value={color} onValueChange={onChangeColor}>
        {COLOR_PALETTE_AVAILABLE.map(
          (color: AppearanceColorOptionsInterface) => (
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={color.value} id={color.value} />
              <Label
                className="cursor-pointer"
                style={{ color: color.color }}
                htmlFor={color.value}
              >
                {color.name}
              </Label>
            </div>
          )
        )}
      </RadioGroup>
    </div>
  );
};

// TODO:: change the design
const LanguageField = () => {
  const { language, setLanguage } = useLanguageStore();

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

  return (
    <div>
      <Label>{translate("floating.changeLanguage")}</Label>
      <RadioGroup value={language} onValueChange={onChangeLangHanlder}>
        {LANGUAGE_OPTIONS.map((lang: GeneralLangOptions) => (
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={lang.value} id={lang.value} />
            <Label className="cursor-pointer" htmlFor={lang.value}>
              {lang.name}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

// TODO:: change the design
const ThemeField = () => {
  const {} = useTranslation();
  const { theme, setTheme } = useSettingsStore();

  const onChangeTheme = (theme: Theme) => {
    setTheme(theme);
    toast({
      variant: "success",
      duration: TOAST_DURATION,
      title: translate("settings.settingsUpdated"),
      description: translate("settings.theme.toast.success.theme", {
        theme: theme,
      }),
    });
  };

  const THEME_AVAILABLE: ApperanceThemeOptionInterface[] = [
    {
      value: "system",
      name: translate("settings.theme.mode.system"),
      icon: (
        <img className="rounded-md" width={"170px"} height={"80px"} src={SLP} />
      ),
    },
    {
      value: "dark",
      name: translate("settings.theme.mode.dark"),
      icon: (
        <img className="rounded-md" width={"170px"} height={"80px"} src={DLP} />
      ),
    },
    {
      value: "light",
      name: translate("settings.theme.mode.light"),
      icon: (
        <img className="rounded-md" width={"170px"} height={"80px"} src={LLP} />
      ),
    },
  ];
  return (
    <div className="">
      <Label>{translate("floating.themeMode")}</Label>
      <RadioGroup
        value={theme}
        onValueChange={(theme: any) => onChangeTheme(theme)}
      >
        {THEME_AVAILABLE.map((theme: ApperanceThemeOptionInterface) => (
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={theme.value as string} id={theme.value} />
            <Label className="cursor-pointer" htmlFor={theme.value}>
              {theme.name}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};
