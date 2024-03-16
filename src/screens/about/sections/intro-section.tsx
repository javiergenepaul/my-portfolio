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
  const DownloadResumeHandler = () => {
    console.log("download resume here");
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
      topTitle: "Project",
      botTitle: "Completed",
    },
    {
      count: moment().diff(moment("2018-08-01"), "years"),
      topTitle: "Years",
      botTitle: "Experience",
    },
  ];

  return (
    <div className="h-screen flex">
      <div className="basis-1/2 flex items-end pl-24">
        <img
          width={"400px"}
          height={"400px"}
          src={AboutMe}
          alt="Gene Paul Mar Javier"
        />
      </div>
      <div className="basis-1/2 flex">
        <div className="flex flex-col justify-center">
          <h3 className="font-medium text-2xl">Hello I'm</h3>
          <h1 className="text-primary text-5xl font-bold">
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
            className="space-x-2 w-fit px-8 mt-4"
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
