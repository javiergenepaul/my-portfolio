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
import { Color, FontType, useLanguageStore, useThemeStore } from "@/stores";
import {
  AppearanceColorOptions,
  AppearanceColorOptionsInterface,
  ApperanceFontOption,
  ApperanceThemeOption,
  ApperanceThemeOptionInterface,
  FontAvailableInterface,
  InpuptFieldGroup,
} from "..";
import { capitalizeFirstLetter } from "@/lib";
import { DLP, LLP, SLP } from "@/assets/layout";

type Theme = "dark" | "light" | "system";

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
    name: translate("settings.color.options.azure"),
    value: "azure",
    color: "#3B82F6",
  },
  {
    name: translate("settings.color.options.emerald"),
    value: "emerald",
    color: "#22C55E",
  },
  {
    name: translate("settings.color.options.golden"),
    value: "golden",
    color: "#FACC15",
  },
  {
    name: translate("settings.color.options.sunset"),
    value: "sunset",
    color: "#EA580C",
  },
  {
    name: translate("settings.color.options.lavender"),
    value: "lavender",
    color: "#6D28D9",
  },
  {
    name: translate("settings.color.options.scarlet"),
    value: "scarlet",
    color: "#E11D48",
  },
  {
    name: translate("settings.color.options.silver"),
    value: "silver",
    color: "#57616D",
  },
];

const TOAST_DURATION: number = 1500;

export const SettingsAppearance = () => {
  const { setTheme, setFont, theme, getSystemTheme, font, color, setColor } =
    useThemeStore();
  const { language } = useLanguageStore();

  const { toast } = useToast();

  const onChangeFont = (value: FontType) => {
    setFont(value);
    toast({
      variant: "success",
      duration: TOAST_DURATION,
      title: "Settings Updated",
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
      title: "Settings Updated",
      description: translate("settings.theme.toast.success.theme", {
        theme: theme,
      }),
    });
  };

  const onChangeColor = (color: Color) => {
    setColor(color);

    toast({
      variant: "success",
      duration: TOAST_DURATION,
      title: "Settings Updated",
      description: translate("settings.color.toast.success", {
        color: COLOR_PALETTE_AVAILABLE.find((data) => data.value === color)
          ?.name,
      }),
    });
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
          value={font}
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
      <InpuptFieldGroup label={"Color"} description={"Color Desc"}>
        <RadioGroup
          onValueChange={onChangeColor}
          value={color}
          defaultValue={color}
          className="flex max-w-[800px] gap-4 pt-2"
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
