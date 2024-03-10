import { useSettingsStore } from "@/stores";
import { Button, Label, RadioGroup, RadioGroupItem, Switch } from "..";
import React from "react";
import { translate } from "@/i18n";
import { generateColorQoutes } from "@/lib";
import {
  AppearanceColorOptionsInterface,
  ApperanceThemeOptionInterface,
} from "@/screens";
import { Settings } from "lucide-react";
import { SLP, DLP, LLP } from "@/assets/layout";

export const FloatingSettingsContent = () => {
  return (
    <div className="p-4 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span>Settings</span>
        <Button variant={"ghost"}>
          <Settings />
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        <BackgroundSwitchField />
        <ParticleSwitchField />
        <ColorPaletteField />
        <ThemeField />
      </div>
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
const ThemeField = () => {
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
