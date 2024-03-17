import { AboutMe, ResumeDark } from "@/assets";
import { Button } from "@/components";
import { ProjectInterface, ProjectStatus } from "@/config";
import { translate } from "@/i18n";
import { SubTitleAnimation } from "@/screens";
import { PROJECTS } from "@/screens/hero/sections";
import { DownloadIcon } from "@radix-ui/react-icons";
import moment from "moment";

interface PersonalStatisticInterface {
  count: number;
  topTitle: string;
  botTitle: string;
}

export const IntroSection = () => {
  /**
   * Handles the download of the resume.
   * Opens the resume in a new tab.
   * @returns {void}
   */
  const DownloadResumeHandler = () => {
    // TODO:: add resume download depends on color palette and theme
    window.open(ResumeDark, "_blank");
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
  );
};
