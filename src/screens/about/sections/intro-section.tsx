import { AboutMe, ResumeDark } from "@/assets";
import { Button } from "@/components";
import { ProjectInterface, ProjectStatus } from "@/config";
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
    <div className="flex flex-col-reverse h-full min-h-screen lg:flex-row">
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
          <h3 className="text-2xl font-medium">Hello I'm</h3>
          <h1 className="text-5xl font-bold text-primary">
            Gene Paul Mar Javier
          </h1>
          <SubTitleAnimation />
          <p className="text-sm text-muted-foreground">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Leo
            pellentesque donec pretium facilisis. Adipiscing neque enim, lacus
            pretium scelerisque proin. Ultrices non gravida vitae, sed sagittis
            arcu. In quisque nulla viverra interdum ac urna auctor. Auctor enim
            leo a nisl massa. Amet cursus odio dolor congue. Eu, bibendum sed
            duis ornare id ut cras. Luctus eget mattis pharetra amet interdum
            commodo.
          </p>
          <Button
            onClick={DownloadResumeHandler}
            className="px-8 mt-4 space-x-2 w-fit"
          >
            <span>Download My Resume</span>
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
            {/* <div className="flex flex-col">
              <h1 className="text-5xl">10+</h1>
              <span className="text-sm text-muted-foreground">
                Project
                <br />
                Completed
              </span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-5xl">5+</h1>
              <span className="text-sm text-muted-foreground">
                Years
                <br />
                Experience
              </span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-5xl">2+</h1>
              <span className="text-sm text-muted-foreground">
                Awards
                <br />
                Achievement
              </span>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
