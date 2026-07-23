import { AboutMe } from "@/assets";
import { Button, LazyImage } from "@/components";
import { ProjectInterface, ProjectStatus } from "@/config";
import { translate } from "@/i18n";
import { getProjects } from "@/config/data";
import { useProfile } from "@/lib/content/use-content";
import { useSettingsStore } from "@/stores";
import { FileText } from "lucide-react";
import { useState } from "react";
import dayjs from "dayjs";
import "../css/intro-section.css";
import { Banner } from "../../components";
import { twMerge } from "tailwind-merge";
import { ResumeModal } from "@/components/common/resume-modal";

interface PersonalStatisticInterface {
  count: number;
  topTitle: string;
  botTitle: string;
}

export const IntroSection = () => {
  const profile = useProfile();
  const { color } = useSettingsStore();
  const [resumeOpen, setResumeOpen] = useState(false);

  /**
   * Counts the number of completed projects.
   * @returns {number} The count of completed projects.
   */
  const countProjectStatus = (status: ProjectStatus): number => {
    let count: number = 0;
    getProjects().forEach((project: ProjectInterface) => {
      if (project.stack && project.status === status) {
        count++;
      }
    });
    return count;
  };

  const STATISTICS: PersonalStatisticInterface[] = [
    {
      count: countProjectStatus("ongoing"),
      topTitle: translate("about.intro.ongoing"),
      botTitle: translate("about.intro.project"),
    },
    {
      count: countProjectStatus("completed"),
      topTitle: translate("about.intro.completed"),
      botTitle: translate("about.intro.project"),
    },
    {
      count: dayjs().diff(dayjs(profile.careerStartDate), "years"),
      topTitle: translate("about.intro.years"),
      botTitle: translate("about.intro.experience"),
    },
  ];

  return (
    <>
      <ResumeModal
        open={resumeOpen}
        onClose={() => setResumeOpen(false)}
        year={2024}
        defaultColor="emerald"
      />
      <div className="relative">
        <Banner />
        <section className="flex flex-col-reverse h-full min-h-screen mx-auto lg:flex-row max-w-7xl">
          <div className="flex items-end w-full pl-0 lg:pb-8 lg:pl-24">
            <LazyImage
              width="400px"
              src={AboutMe}
              alt={translate("about.intro.name")}
            />
          </div>
          <div className="flex w-full">
            <div className="flex flex-col justify-end pb-8 lg:pb-28">
              <h3 className="text-2xl">{translate("about.intro.hello")}</h3>
              <h1 className="text-4xl font-bold text-primary">
                {translate("about.intro.name")}
              </h1>
              <p className="mt-4 text-sm text-muted-foreground">
                {translate("about.intro.intruduction")}
              </p>
              <Button
                onClick={() => setResumeOpen(true)}
                className={twMerge(
                  "transition-colors px-8 mt-4 space-x-2 text-foreground w-fit",
                  color === "silver" ? "text-primary-foreground" : "",
                )}
              >
                <span>Build My Resume</span>
                <FileText
                  className={twMerge(
                    "transition-colors duration-300 text-foreground",
                    color === "silver" ? "text-primary-foreground" : "",
                  )}
                  width={"20px"}
                  height={"20px"}
                />
              </Button>

              <div className="grid grid-cols-3 mt-10">
                {STATISTICS.map((item: PersonalStatisticInterface) => {
                  return (
                    <div key={item.count} className="flex flex-col">
                      <h1
                        suppressHydrationWarning
                        className="text-5xl font-semibold text-primary"
                      >
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
    </>
  );
};
