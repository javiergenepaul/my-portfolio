import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components";
import { ProjectInterface, TechStackInterface } from "@/config";
import { translate } from "@/i18n";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  CodeIndicator,
  DemoIndicator,
  KeyContributionIndicator,
} from "./indicator";
import { ProjectCardTag } from ".";

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
  const showTag = (): React.ReactNode => {
    switch (type) {
      case "confidential":
        return (
          <ProjectCardTag className={"bg-destructive"}>
            {translate("projects.tag.confidential")}
          </ProjectCardTag>
        );
      case "personal":
        return (
          <ProjectCardTag className={"bg-primary"}>
            {translate("projects.tag.personal")}
          </ProjectCardTag>
        );
      case "client":
        return (
          <ProjectCardTag className={"bg-yellow-700"}>
            {translate("projects.tag.personal")}
          </ProjectCardTag>
        );
      case "tutorial":
        return (
          <ProjectCardTag className={"bg-slate-500"}>
            {translate("projects.tag.tutorial")}
          </ProjectCardTag>
        );
      default:
        return null;
    }
  };

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
    <Card className="relative overflow-hidden">
      {showTag()}
      <div className="flex h-full">
        <div
          className="relative items-center justify-center cursor-not-allowed select-none basis-1/3"
          onMouseEnter={onMouseEnterPreviewHandler}
          onMouseLeave={onMouseLeavePreviewHandler}
        >
          <div
            onClick={onClickPreviewUrl}
            className={twMerge(
              "absolute z-20 hidden items-center justify-center w-full h-full bg-black/25 backdrop-blur-sm cursor-not-allowed hover:flex duration-300 select-none",
              `${isPreviewHovered ? "flex" : ""}`
            )}
          >
            {previewUrl ? "Demo Preview" : "Demo Unavailable"}
          </div>
          <img className="z-10 h-full" src={image64} alt={imageName} />
        </div>
        <div className="flex flex-col basis-2/3">
          <CardHeader>
            <CardTitle className="flex items-center gap-4 select-none group-hover:text-primary">
              {title}
            </CardTitle>
            <div className="flex gap-2">
              <CodeIndicator title={title} codeUrl={codeUrl} />
              <KeyContributionIndicator contributions={["test"]} />
              <DemoIndicator previewUrl={previewUrl} title={title} />
            </div>
            <CardDescription className="select-none">{description}</CardDescription>
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
