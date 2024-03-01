import {
  Badge,
  BounceText,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components";
import { ProjectInterface, TechStackInterface } from "@/config";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  CodeIndicator,
  DemoIndicator,
  KeyContributionIndicator,
} from "./indicator";
import { ShowTag } from "./show-tag";
import { Eye, EyeOff } from "lucide-react";
import { translate } from "@/i18n";

interface ProjectCardInterface extends ProjectInterface {}

export const ProjectCard = (props: ProjectCardInterface) => {
  const {
    title,
    description,
    stack,
    type,
    previewUrl,
    codeUrl,
    image64,
    imageName,
  } = props;

  const [isPreviewHovered, setIsPreviewHovered] = useState<boolean>(false);

  const onMouseEnterPreviewHandler = () => {
    setIsPreviewHovered(true);
  };

  const onMouseLeavePreviewHandler = () => {
    setIsPreviewHovered(false);
  };

  const onClickPreviewUrl = () => {
    if (previewUrl) {
      window.open(previewUrl, "_blank");
    }
  };

  return (
    <Card className="relative p-0 overflow-hidden">
      <ShowTag type={type} />
      <div className="flex flex-col gap-4 px-4 py-6 xl:flex-row md:px-8 h-fit">
        <div
          className={twMerge(
            "items-center relative justify-center overflow-hidden rounded-lg cursor-not-allowed select-none md:basis-2/5",
            previewUrl ? "cursor-pointer" : ""
          )}
          onMouseEnter={onMouseEnterPreviewHandler}
          onMouseLeave={onMouseLeavePreviewHandler}
        >
          <div
            onClick={onClickPreviewUrl}
            className={twMerge(
              "absolute z-20 hidden items-center justify-center w-full h-full rounded-lg bg-black/25 backdrop-blur-sm hover:flex duration-300 select-none",
              `${isPreviewHovered ? "flex gap-2" : ""}`
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
          <img className="flex h-full" src={image64} alt={imageName} />
        </div>
        <div className="flex flex-col md:basis-3/5">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="flex items-center gap-4 select-none group-hover:text-primary">
              <h3 className="font-bold">
                <BounceText className="cursor-default" text={title} />
              </h3>
            </CardTitle>
            <div className="flex gap-4">
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
          <CardContent className="flex flex-wrap gap-2 px-0 pb-0">
            {stack?.map((stack: TechStackInterface, index: React.Key) => {
              return (
                <Badge key={index} className="cursor-pointer">
                  {stack.url ? (
                    <a href={stack.url} target="_blank" rel="noreferrer">
                      {stack.name}
                    </a>
                  ) : (
                    stack.name
                  )}
                </Badge>
              );
            })}
          </CardContent>
        </div>
      </div>
    </Card>
  );
};
