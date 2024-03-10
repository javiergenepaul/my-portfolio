import { LanguageType, useLanguageStore, useSettingsStore } from "@/stores";
import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Label,
  RadioGroup,
  RadioGroupItem,
  Switch,
} from "..";
import React, { useState } from "react";
import { i18n, translate } from "@/i18n";
import { generateColorQoutes } from "@/lib";
import {
  AppearanceColorOptionsInterface,
  ApperanceThemeOptionInterface,
  GeneralLangOptions,
} from "@/screens";
import { ChevronsUpDown } from "lucide-react";
import { SLP, DLP, LLP } from "@/assets/layout";
import { USFlag, JPFlag, PHFlag } from "@/assets";
import { useTranslation } from "react-i18next";

export const FloatingSettingsContent = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div
      className="p-4 flex flex-col gap-2"
      onMouseLeave={() => {
        setIsOpen(false);
      }}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex justify-between gap-4 items-center">
          <span>Settings</span>
          <CollapsibleTrigger asChild>
            <Button variant={"ghost"} size={"sm"}>
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
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
  return (
    <div className="flex items-center gap-2">
      <Switch
        id={backgroundId}
        checked={isBackgroundOnly}
        onCheckedChange={setIsBackgroundOnly}
      />
      <Label htmlFor={backgroundId}>Background-Only Mode</Label>
    </div>
  );
};

// TODO:: change the design
const ParticleSwitchField = () => {
  const particleId = React.useId();
  const { enableParticleBackground, setEnableParticleBackground } =
    useSettingsStore();

  return (
    <div className="flex items-center gap-2">
      <Switch
        id={particleId}
        checked={enableParticleBackground}
        onCheckedChange={setEnableParticleBackground}
      />
      <Label htmlFor={particleId}>Disable Particle</Label>
    </div>
  );
};

// TODO:: change the design
const ColorPaletteField = () => {
  const {} = useTranslation();
  const { color, setColor } = useSettingsStore();
  const COLOR_PALETTE_AVAILABLE: AppearanceColorOptionsInterface[] = [
    {
      name: translate("settings.color.options.emerald.title"),
      value: "emerald",
      color: "#22C55E",
      qoutes: [...generateColorQoutes("emerald")],
    },
    {
      name: translate("settings.color.options.azure.title"),
      value: "azure",
      color: "#3B82F6",
      qoutes: [...generateColorQoutes("azure")],
    },
    {
      name: translate("settings.color.options.golden.title"),
      value: "golden",
      color: "#FACC15",
      qoutes: [...generateColorQoutes("golden")],
    },
    {
      name: translate("settings.color.options.sunset.title"),
      value: "sunset",
      color: "#EA580C",
      qoutes: [...generateColorQoutes("sunset")],
    },
    {
      name: translate("settings.color.options.lavender.title"),
      value: "lavender",
      color: "#6D28D9",
      qoutes: [...generateColorQoutes("lavender")],
    },
    {
      name: translate("settings.color.options.scarlet.title"),
      value: "scarlet",
      color: "#E11D48",
      qoutes: [...generateColorQoutes("scarlet")],
    },
    {
      name: translate("settings.color.options.silver.title"),
      value: "silver",
      color: "#57616D",
      qoutes: [...generateColorQoutes("silver")],
    },
  ];

  return (
    <div className="">
      <Label>Color Palette</Label>
      <RadioGroup value={color} onValueChange={setColor}>
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

  const onChangeLangHandler = (value: LanguageType) => {
    setLanguage(value);
    i18n.changeLanguage(value);
  };
  return (
    <div className="">
      <Label>Change Language</Label>
      <RadioGroup value={language} onValueChange={onChangeLangHandler}>
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
      <Label>Theme Mode</Label>
      <RadioGroup value={theme} onValueChange={(theme: any) => setTheme(theme)}>
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
