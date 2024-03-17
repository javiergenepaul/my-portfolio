import { AboutMe } from "@/assets";
import { Button } from "@/components";
import { ProjectInterface, ProjectStatus } from "@/config";
import { translate } from "@/i18n";
import { SubTitleAnimation } from "@/screens";
import { PROJECTS } from "@/screens/hero/sections";
import { useSettingsStore } from "@/stores";
import { DownloadIcon } from "@radix-ui/react-icons";
import * as DarkResume from "@/assets/resume/dark";
import * as LightResume from "@/assets/resume/light";
import { Brain, Lightbulb } from "lucide-react";
import { getColor } from "@/lib";
import moment from "moment";
import "./css/intro-section.css";

interface PersonalStatisticInterface {
  count: number;
  topTitle: string;
  botTitle: string;
}

export const IntroSection = () => {
  const { getTheme, color } = useSettingsStore();

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

  const STATISTICS: PersonalStatisticInterface[] = [
    {
      count: countProjectStatus("ongoing"),
      topTitle: "Ongoing",
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

  return (
    <div className="relative h-full min-h-screen">
      <div className="absolute overflow-hidden w-screen bottom-0 left-[-100px]">
        <div className="flex px-4 py-2 overflow-hidden bg-popover">
          <div className="flex gap-2 -ml-2">
            <div className="flex gap-24 logo-slide flex-nowrap animate-tape">
              {Array.from({ length: 999 }, (_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 flex-nowrap"
                >
                  {index % 2 === 0 ? (
                    <Lightbulb
                      color={getColor(color)}
                      width={"18px"}
                      height={"18px"}
                    />
                  ) : (
                    <Brain
                      color={getColor(color)}
                      width={"18px"}
                      height={"18px"}
                    />
                  )}

                  <span className="text-xs text-nowrap">
                    {translate("about.slogan")}
                  </span>
                  {index % 2 === 0 ? (
                    <Lightbulb
                      color={getColor(color)}
                      width={"18px"}
                      height={"18px"}
                    />
                  ) : (
                    <Brain
                      color={getColor(color)}
                      width={"18px"}
                      height={"18px"}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <section className="flex flex-col-reverse h-full min-h-screen lg:flex-row">
        <div className="flex items-end w-full pl-0 lg:pl-24">
          <img
            width={"400px"}
            height={"400px"}
            src={AboutMe}
            alt="Gene Paul Mar Javier"
          />
        </div>
        <div className="flex w-full">
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-medium">{translate("about.hello")}</h3>
            <h1 className="text-5xl font-bold text-primary">
              {translate("about.name")}
            </h1>
            <SubTitleAnimation />
            <p className="mt-4 text-sm text-muted-foreground">
              {translate("about.intruduction")}
            </p>
            <Button
              onClick={DownloadResumeHandler}
              className="px-8 mt-4 space-x-2 w-fit"
            >
              <span>{translate("about.downloadResume")}</span>
              <DownloadIcon />
            </Button>

            <div className="grid grid-cols-3 mt-8">
              {STATISTICS.map((item: PersonalStatisticInterface) => {
                return (
                  <div className="flex flex-col">
                    <h1 className="text-5xl font-semibold">{item.count}+</h1>
                    <span className="text-sm text-muted-foreground">
                      {item.topTitle}
                      <br />
                      {item.botTitle}
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
