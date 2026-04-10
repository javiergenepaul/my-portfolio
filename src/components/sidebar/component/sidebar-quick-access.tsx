"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useSettingsStore, useLanguageStore, Color, Theme, LanguageType } from "@/stores";
import { translate, useLocaleRefresh } from "@/i18n";
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
import { cn } from "@/lib/utils";
import { USFlag, JPFlag, PHFlag } from "@/assets";

const COLORS: { value: Color; color: (isDark: boolean) => string }[] = [
  { value: "emerald",  color: () => EMERALD_COLOR },
  { value: "azure",    color: () => AZURE_COLOR },
  { value: "golden",   color: () => GOLDEN_COLOR },
  { value: "sunset",   color: () => SUNSET_COLOR },
  { value: "lavender", color: () => LAVENDER_COLOR },
  { value: "scarlet",  color: () => SCARLET_COLOR },
  { value: "silver",   color: (isDark) => isDark ? SILVER_COLOR_DARK : SILVER_COLOR },
];

const THEMES: { value: Theme; icon: React.ReactNode; label: string }[] = [
  { value: "light",  icon: <Sun  className="h-4 w-4" />, label: "Light"  },
  { value: "dark",   icon: <Moon className="h-4 w-4" />, label: "Dark"   },
  { value: "system", icon: <Monitor className="h-4 w-4" />, label: "Auto" },
];

const LANGUAGES: { value: LanguageType; flag: string; label: string }[] = [
  { value: "en",  flag: USFlag, label: "EN" },
  { value: "ja",  flag: JPFlag, label: "JA" },
  { value: "fil", flag: PHFlag, label: "FIL" },
  { value: "ceb", flag: PHFlag, label: "CEB" },
];

export const SidebarQuickAccess = () => {
  useLocaleRefresh();
  const { theme, setTheme, color, setColor, getTheme } = useSettingsStore();
  const { language, setLanguage } = useLanguageStore();
  const isDark = !getTheme();

  return (
    <div className="flex flex-col gap-4 pt-4 border-t border-border">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-2">
        {translate("floating.quickAccess")}
      </p>

      {/* Theme */}
      <div className="flex flex-col gap-1.5 px-2">
        <p className="text-xs text-muted-foreground">{translate("floating.themeMode")}</p>
        <div className="flex gap-2">
          {THEMES.map((t) => (
            <button
              key={t.value}
              onClick={() => setTheme(t.value)}
              aria-label={t.label}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm transition-colors",
                theme === t.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
              )}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Color palette */}
      <div className="flex flex-col gap-1.5 px-2">
        <p className="text-xs text-muted-foreground">{translate("floating.colorPalette")}</p>
        <div className="flex gap-2.5 flex-wrap">
          {COLORS.map((c) => {
            const hex = c.color(isDark);
            return (
              <button
                key={c.value}
                onClick={() => setColor(c.value)}
                aria-label={c.value}
                style={{ backgroundColor: hex }}
                className={cn(
                  "h-7 w-7 rounded-full border-2 transition-transform",
                  color === c.value
                    ? "border-foreground scale-110"
                    : "border-transparent hover:scale-105"
                )}
              />
            );
          })}
        </div>
      </div>

      {/* Language */}
      <div className="flex flex-col gap-1.5 px-2">
        <p className="text-xs text-muted-foreground">{translate("floating.changeLanguage")}</p>
        <div className="flex gap-2 flex-wrap">
          {LANGUAGES.map((l) => (
            <button
              key={l.value}
              onClick={() => setLanguage(l.value)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-sm transition-colors",
                language === l.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
              )}
            >
              <img src={l.flag} alt={l.label} className="h-3.5 w-5 object-cover rounded-sm" />
              <span className="text-xs font-medium">{l.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
