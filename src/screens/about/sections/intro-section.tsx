import { AboutMe } from "@/assets";
import { Button } from "@/components";
import { ProjectInterface, ProjectStatus } from "@/config";
import { translate } from "@/i18n";
import { PROJECTS } from "@/screens/hero/sections";
import { useSettingsStore } from "@/stores";
import { DownloadIcon } from "@radix-ui/react-icons";
import { Brain, Lightbulb } from "lucide-react";
import { getColor } from "@/lib";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

import * as LightResume from "@/assets/resume/light";
import * as DarkResume from "@/assets/resume/dark";

import moment from "moment";
import "./css/intro-section.css";

interface PersonalStatisticInterface {
  count: number;
  topTitle: string;
  botTitle: string;
}

export const IntroSection = () => {
  const { getTheme, color } = useSettingsStore();
  const [isPauseAnimateBanner, setIsPauseAnimateBanner] =
    useState<boolean>(false);

  /**
   * Returns the appropriate resume based on the selected theme and color.
   * @returns {string} The URL of the selected resume.
   */
  const getResumeTemplates = (): string => {
    if (getTheme()) {
      switch (color) {
        case "azure":
          return DarkResume.ResumeDarkAzureBliss;
        case "emerald":
          return DarkResume.ResumeDarkEmeraldElegance;
        case "golden":
          return DarkResume.ResumeDarkGoldenHaze;
        case "sunset":
          return DarkResume.ResumeDarkSunsetEmber;
        case "lavender":
          return DarkResume.ResumeDarkPurpleMajesty;
        case "scarlet":
          return DarkResume.ResumeDarkScarletSerenade;
        case "silver":
          return DarkResume.ResumeDarkSilverSerenity;
        default:
          return DarkResume.ResumeDarkEmeraldElegance;
      }
    } else {
      switch (color) {
        case "azure":
          return LightResume.ResumeLightAzureBliss;
        case "emerald":
          return LightResume.ResumeLightEmeraldElegance;
        case "golden":
          return LightResume.ResumeLightGoldenHaze;
        case "sunset":
          return LightResume.ResumeLightSunsetEmber;
        case "lavender":
          return LightResume.ResumeLightPurpleMajesty;
        case "scarlet":
          return LightResume.ResumeLightScarletSerenade;
        case "silver":
          return LightResume.ResumeLightSilverSerenity;
        default:
          return LightResume.ResumeLightEmeraldElegance;
      }
    }
  };

  /**
   * Handles the download of the resume.
   * Opens the resume in a new tab.
   * @returns {void}
   */
  const DownloadResumeHandler = () => {
    window.open(getResumeTemplates(), "_blank");
  };

  /**
   * Counts the number of completed projects.
   * @returns {number} The count of completed projects.
   */
  const countProjectStatus = (status: ProjectStatus): number => {
    let count: number = 0;
    PROJECTS.forEach((project: ProjectInterface) => {
      if (project.stack && project.status === status) {
        count++;
      }
    });
    return count;
  };

  let hoverTimeout: string | number | NodeJS.Timeout | undefined;
  const onMouseEnterBanner = () => {
    hoverTimeout = setTimeout(() => {
      setIsPauseAnimateBanner(true);
    }, 300); // Adjust delay time in milliseconds (e.g., 500 for 0.5 seconds)
  };

  const onMouseLeaveBanner = () => {
    clearTimeout(hoverTimeout);
    setIsPauseAnimateBanner(false);
  };

  const STATISTICS: PersonalStatisticInterface[] = [
    // TODO:: change translate
    {
      count: countProjectStatus("ongoing"),
      topTitle: "Ongoing", //TODO:: change into certificate
      botTitle: "Project",
    },
    {
      count: countProjectStatus("completed"),
      topTitle: "Completed",
      botTitle: "Project",
    },
    {
      count: moment().diff(moment("2018-08-01"), "years"),
      topTitle: "Years",
      botTitle: "Experience",
    },
  ];

  const BANNER_ICON_SIZE: string = "1.125rem";

  return (
    <div className="relative">
      <div className="absolute overflow-hidden w-screen bottom-0 left-[-24px] md:left-[-24px] lg:left-[-96px]">
        <div
          onMouseEnter={onMouseEnterBanner}
          onMouseLeave={onMouseLeaveBanner}
          className="flex px-4 py-2 overflow-hidden border bg-popover"
        >
          <div className="flex gap-2 -ml-2">
            <div
              className={twMerge(
                "flex gap-24 logo-slide flex-nowrap animate-tape",
                isPauseAnimateBanner ? "pause-tape-animation" : ""
              )}
            >
              {Array.from({ length: 50 }, (_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 flex-nowrap"
                >
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
      <section className="flex flex-col-reverse h-full min-h-screen mx-auto lg:flex-row max-w-7xl">
        <div className="flex items-end w-full pl-0 lg:pb-8 lg:pl-24">
          <img
            width={"400px"}
            height={"400px"}
            src={AboutMe}
            alt={translate("about.name")}
          />
        </div>
        <div className="flex w-full">
          <div className="flex flex-col justify-end pb-8 lg:pb-28">
            <h3 className="text-2xl">{translate("about.hello")}</h3>
            <h1 className="text-4xl font-bold text-primary">
              {translate("about.name")}
            </h1>
            <p className="mt-4 text-sm text-muted-foreground">
              {translate("about.intruduction")}
            </p>
            <Button
              onClick={DownloadResumeHandler}
              className="px-8 mt-4 space-x-2 text-foreground w-fit"
            >
              <span>{translate("about.downloadResume")}</span>
              <DownloadIcon
                className="transition-colors duration-300 text-foreground"
                width={"20px"}
                height={"20px"}
              />
            </Button>

            <div className="grid grid-cols-3 mt-10">
              {STATISTICS.map((item: PersonalStatisticInterface) => {
                return (
                  <div className="flex flex-col">
                    <h1 className="text-5xl font-semibold text-primary">
                      {item.count}+
                    </h1>
                    <span className="text-sm text-muted-foreground">
                      <p>{item.topTitle}</p>
                      <p>{item.botTitle}</p>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
