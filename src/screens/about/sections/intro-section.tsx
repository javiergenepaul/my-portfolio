<<<<<<< HEAD
import { AboutMe } from "@/assets";
import { Button } from "@/components";
import { ProjectInterface, ProjectStatus } from "@/config";
import { translate } from "@/i18n";
import { SubTitleAnimation } from "@/screens";
import { PROJECTS } from "@/screens/hero/sections";
import { useSettingsStore } from "@/stores";
import { DownloadIcon } from "@radix-ui/react-icons";
import moment from "moment";

import * as DarkResume from "@/assets/resume/dark";
import * as LightResume from "@/assets/resume/light";

=======
import { AboutMe, ResumeDark } from "@/assets";
import { Button } from "@/components";
import { ProjectInterface, ProjectStatus } from "@/config";
import { SubTitleAnimation } from "@/screens";
import { PROJECTS } from "@/screens/hero/sections";
import { DownloadIcon } from "@radix-ui/react-icons";
import moment from "moment";

>>>>>>> master
interface PersonalStatisticInterface {
  count: number;
  topTitle: string;
  botTitle: string;
}

export const IntroSection = () => {
<<<<<<< HEAD
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

=======
>>>>>>> master
  /**
   * Handles the download of the resume.
   * Opens the resume in a new tab.
   * @returns {void}
   */
  const DownloadResumeHandler = () => {
<<<<<<< HEAD
    window.open(getResumeTemplates(), "_blank");
=======
    // TODO:: add resume download depends on color palette and theme
    window.open(ResumeDark, "_blank");
>>>>>>> master
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
<<<<<<< HEAD
    <section className="flex flex-col-reverse h-full min-h-screen lg:flex-row">
=======
    <div className="flex flex-col-reverse h-full min-h-screen lg:flex-row">
>>>>>>> master
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
<<<<<<< HEAD
          <h3 className="text-2xl font-medium">{translate("about.hello")}</h3>
          <h1 className="text-5xl font-bold text-primary">
            {translate("about.name")}
          </h1>
          <SubTitleAnimation />
          <p className="mt-4 text-sm text-muted-foreground">
            {translate("about.intruduction")}
=======
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
>>>>>>> master
          </p>
          <Button
            onClick={DownloadResumeHandler}
            className="px-8 mt-4 space-x-2 w-fit"
          >
<<<<<<< HEAD
            <span>{translate("about.downloadResume")}</span>
=======
            <span>Download My Resume</span>
>>>>>>> master
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
<<<<<<< HEAD
          </div>
        </div>
      </div>
    </section>
=======
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
>>>>>>> master
  );
};
