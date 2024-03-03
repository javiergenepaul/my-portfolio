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
import { FontType, useLanguageStore, useThemeStore } from "@/stores";
import {
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

export const SettingsAppearance = () => {
  const { setTheme, setFont, theme, getSystemTheme, font } = useThemeStore();
  const { language } = useLanguageStore();

  const { toast } = useToast();

  const onChangeFont = (value: FontType) => {
    setFont(value);
    toast({
      variant: "success",
      duration: 3000,
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
      duration: 3000,
      title: "Settings Updated",
      description: translate("settings.theme.toast.success.theme", {
        theme: theme,
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

      <InpuptFieldGroup
        label={translate("settings.theme.theme")}
        description={translate("settings.theme.formDescription")}
      >
        <RadioGroup
          onValueChange={onChangeTheme}
          value={theme}
          defaultValue={getSystemTheme()}
          className="grid max-w-[800px] grid-cols-1 md:grid-cols-3 gap-8 pt-2"
        >
          {THEME_AVAILABLE.map(
            (themeProps: ApperanceThemeOptionInterface, index: React.Key) => {
              return <ApperanceThemeOption key={index} {...themeProps} />;
            }
          )}
        </RadioGroup>
      </InpuptFieldGroup>
    </div>
  );
};
