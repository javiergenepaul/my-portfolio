import {
  useToast,
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  RadioGroup,
} from "@/components";
import { translate } from "@/i18n";
import { Color, FontType, useLanguageStore, useSettingsStore } from "@/stores";
import {
  AppearanceColorOptions,
  AppearanceColorOptionsInterface,
  ApperanceFontOption,
  ApperanceThemeOption,
  ApperanceThemeOptionInterface,
  FontAvailableInterface,
  InpuptFieldGroup,
} from "..";
import {
  capitalizeFirstLetter,
  generateColorQoutes,
  getRandomGeneratedColorQoutes,
} from "@/lib";
import { DLP, LLP, SLP } from "@/assets/layout";

type Theme = "dark" | "light" | "system";
const TOAST_DURATION: number = 2000;

const FONT_AVAILABLE: FontAvailableInterface[] = [
  {
    fontName: translate("settings.font.type.inter"),
    fontClassName: "font-inter",
    value: "inter",
  },
  {
    fontName: "Work Sans",
    fontClassName: "font-work-sans",
    value: "work-sans",
  },
  {
    fontName: "Poppins",
    fontClassName: "font-poppins",
    value: "poppins",
  },
];

const THEME_AVAILABLE: ApperanceThemeOptionInterface[] = [
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
  {
    value: "system",
    name: translate("settings.theme.mode.system"),
    icon: (
      <img className="rounded-md" width={"170px"} height={"80px"} src={SLP} />
    ),
  },
];

export const COLOR_PALETTE_AVAILABLE: AppearanceColorOptionsInterface[] = [
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

export const SettingsAppearance = () => {
  const { setTheme, setFont, theme, getSystemTheme, font, color, setColor } =
    useSettingsStore();
  const { language } = useLanguageStore();

  const { toast } = useToast();

  const onChangeFont = (value: FontType) => {
    setFont(value);
    toast({
      variant: "success",
      duration: TOAST_DURATION,
      title: translate("settings.settingsUpdated"),
      description: translate("settings.font.toast.success.font", {
        fontName: capitalizeFirstLetter(value),
      }),
    });
  };

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

  return (
    <div className="space-y-8">
      {/* FONT SETTINGS */}
      <InpuptFieldGroup
        isHidden={language === "ja"}
        label={translate("settings.font.font")}
        description={translate("settings.font.instruction")}
      >
        <Select
          onValueChange={onChangeFont}
          defaultValue={font ? font : "inter"}
          value={font ? font : "inter"}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {FONT_AVAILABLE.map(
                (fontProps: FontAvailableInterface, index: React.Key) => {
                  return <ApperanceFontOption key={index} {...fontProps} />;
                }
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </InpuptFieldGroup>

      {/* THEME SETTINGS */}
      <InpuptFieldGroup
        label={translate("settings.theme.theme")}
        description={translate("settings.theme.formDescription")}
      >
        <RadioGroup
          onValueChange={onChangeTheme}
          value={theme}
          defaultValue={getSystemTheme()}
          className="grid max-w-[800px] grid-cols-3 gap-8 pt-2"
        >
          {THEME_AVAILABLE.map(
            (themeProps: ApperanceThemeOptionInterface, index: React.Key) => {
              return <ApperanceThemeOption key={index} {...themeProps} />;
            }
          )}
        </RadioGroup>
      </InpuptFieldGroup>

      {/* COLOR PALETTE SETTINGS */}
      <InpuptFieldGroup
        label={translate("settings.color.color")}
        description={translate("settings.color.formDescription")}
      >
        <RadioGroup
          onValueChange={onChangeColor}
          value={color}
          defaultValue={color}
          className="max-w-[800px] grid-cols-3 gap-4 pt-2"
        >
          {COLOR_PALETTE_AVAILABLE.map(
            (themeProps: AppearanceColorOptionsInterface, index: React.Key) => {
              return <AppearanceColorOptions key={index} {...themeProps} />;
            }
          )}
        </RadioGroup>
      </InpuptFieldGroup>
    </div>
  );
};
