import { translate } from "@/i18n";
import { getColor } from "@/lib";
import { useSettingsStore } from "@/stores";
import { Brain, Lightbulb } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

export const Banner = () => {
  const [isPauseAnimateBanner, setIsPauseAnimateBanner] =
    useState<boolean>(false);
  const { color } = useSettingsStore();

  let hoverTimeout: string | number | NodeJS.Timeout | undefined;
  const onMouseEnterBanner = () => {
    hoverTimeout = setTimeout(() => {
      setIsPauseAnimateBanner(true);
    }, 300);
  };

  const BANNER_ICON_SIZE: string = "1.125rem";

  const onMouseLeaveBanner = () => {
    clearTimeout(hoverTimeout);
    setIsPauseAnimateBanner(false);
  };

  return (
    <div className="absolute z-10 overflow-hidden w-screen bottom-0 left-[-24px] md:left-[-24px] lg:left-[-96px]">
      <div
        onMouseEnter={onMouseEnterBanner}
        onMouseLeave={onMouseLeaveBanner}
        className="flex px-4 py-2 overflow-hidden border-t border-b bg-popover"
      >
        <div className="flex gap-2 -ml-2">
          <div
            className={twMerge(
              "flex gap-24 logo-slide flex-nowrap animate-tape",
              isPauseAnimateBanner ? "pause-tape-animation" : ""
            )}
          >
            {Array.from({ length: 50 }, (_, index) => (
              <div key={index} className="flex items-center gap-2 flex-nowrap">
                {index % 2 === 0 ? (
                  <Lightbulb
                    color={getColor(color)}
                    width={BANNER_ICON_SIZE}
                    height={BANNER_ICON_SIZE}
                  />
                ) : (
                  <Brain
                    color={getColor(color)}
                    width={BANNER_ICON_SIZE}
                    height={BANNER_ICON_SIZE}
                  />
                )}

                <span className="text-xs text-nowrap">
                  {translate("about.slogan")}
                </span>
                {index % 2 === 0 ? (
                  <Lightbulb
                    color={getColor(color)}
                    width={BANNER_ICON_SIZE}
                    height={BANNER_ICON_SIZE}
                  />
                ) : (
                  <Brain
                    color={getColor(color)}
                    width={BANNER_ICON_SIZE}
                    height={BANNER_ICON_SIZE}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
