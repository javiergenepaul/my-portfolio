import {
  BounceText,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components";
import { ProjectInterface, TechStackInterface } from "@/config";
import { twMerge } from "tailwind-merge";
import {
  CodeIndicator,
  DemoIndicator,
  KeyContributionIndicator,
} from "./indicator";
import { ShowTag } from "./show-tag";
import { Eye, EyeOff } from "lucide-react";
import { translate } from "@/i18n";
import { StackContent } from "@/screens";
import { ProjectCarousel } from "./project-carousel";

interface ProjectCardInterface extends ProjectInterface {}

const ProjectCard = (props: ProjectCardInterface) => {
  const {
    type,
    title,
    stack,
    codeUrl,
    carousel,
    projectId,
    previewUrl,
    description,
  } = props;

  const onClickPreviewUrl = () => {
    if (previewUrl) {
      window.open(previewUrl, "_blank");
    }
  };

  return (
    <Card className="relative p-0 overflow-hidden">
      <ShowTag type={type} />
      <div className="flex flex-col">
        <div className="flex flex-col gap-4 px-4 py-6 pb-4 xl:flex-row md:px-8 h-fit">
          <div
            className={twMerge(
              "items-center relative justify-center overflow-hidden rounded-lg cursor-not-allowed select-none md:basis-2/5",
              previewUrl ? "cursor-pointer" : ""
            )}
          >
            <div
              onClick={onClickPreviewUrl}
              className={twMerge(
                "absolute z-20 hidden items-center justify-center w-full h-full bg-black/25 backdrop-blur-sm hover:flex duration-300 select-none"
              )}
            >
              {previewUrl ? (
                <>
                  <Eye /> {translate("projects.indicator.viewDemo")}
                </>
              ) : (
                <>
                  <EyeOff /> {translate("projects.indicator.demoUnavailable")}
                </>
              )}
            </div>
            <ProjectCarousel projectId={projectId} carousel={carousel} />
          </div>
          <div className="flex flex-col md:basis-3/5">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="flex items-center gap-4 select-none group-hover:text-primary">
                <h3 className="font-bold">
                  <BounceText className="cursor-default" text={title} />
                </h3>
              </CardTitle>
              <div className="flex gap-2">
                <KeyContributionIndicator contributions={["test"]} />
                <DemoIndicator title={title} previewUrl={previewUrl} />
                <CodeIndicator title={title} codeUrl={codeUrl} />
              </div>
              <CardDescription className="flex flex-col gap-2 select-none">
                <span className="text-sm font-medium dark:text-white Description">
                  {translate("projects.indicator.description")}
                </span>
                {description}
              </CardDescription>
            </CardHeader>
          </div>
        </div>
        <div className="px-4 md:px-8 pb-6 flex flex-wrap gap-2">
          {stack?.map((stack: TechStackInterface, index: React.Key) => {
            return <StackContent key={index} {...stack} />;
          })}
        </div>
      </div>
    </Card>
  );
};

export default ProjectCard;
