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
import { CodeIndicator, KeyContributionIndicator } from "./indicator";
import { ShowTag } from "./show-tag";
import { Eye, EyeOff } from "lucide-react";

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
      <div className="flex px-8 py-6 h-fit">
        <div
          className={twMerge(
            "relative items-center justify-center overflow-hidden rounded-lg cursor-not-allowed select-none basis-2/5",
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
                <Eye /> {"View Demo"}
              </>
            ) : (
              <>
                <EyeOff /> {"Demo Unavailable"}
              </>
            )}
          </div>
          <img className="flex h-full" src={image64} alt={imageName} />
        </div>
        <div className="flex flex-col basis-3/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-4 select-none group-hover:text-primary">
              <h3 className="font-bold">
                <BounceText className="cursor-default" text={title} />
              </h3>
            </CardTitle>
            <div className="flex gap-4">
              <KeyContributionIndicator contributions={["test"]} />
              <CodeIndicator title={title} codeUrl={codeUrl} />
            </div>
            <CardDescription className="flex flex-col gap-2 select-none">
              <span className="text-sm font-medium text-white Description">
                Description
              </span>
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
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
