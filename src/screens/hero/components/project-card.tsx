import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components";
import { ProjectInterface, TechStackInterface } from "@/config";
import { translate } from "@/i18n";
import { Icon } from "@iconify/react/dist/iconify.js";

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

  const onClickViewDemoHandler = () => {
    window.open(previewUrl, "_blank");
  };

  const onClickSourceCodeHandler = () => {
    window.open(codeUrl, "_blank");
  };

  const showTag = (): React.ReactNode => {
    switch (type) {
      case "confidential":
        return (
          <div className="absolute right-[-40px] w-40 px-4 py-1 text-xs text-center rotate-45 top-[28px] select-none bg-destructive">
            {translate("projects.tag.confidential")}
          </div>
        );
      case "personal":
        return (
          <div className="absolute right-[-40px] w-40 px-4 py-1 text-xs text-center rotate-45 top-[28px] select-none bg-primary">
            {translate("projects.tag.personal")}
          </div>
        );
      case "client":
        return (
          <div className="absolute right-[-40px] w-40 px-4 py-1 text-xs text-center rotate-45 top-[28px] select-none bg-yellow-700">
            {translate("projects.tag.client")}
          </div>
        );
      case "tutorial":
        return (
          <div className="absolute right-[-40px] w-40 px-4 py-1 text-xs text-center rotate-45 top-[28px] select-none bg-slate-500">
            {translate("projects.tag.tutorial")}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="relative overflow-hidden select-none group">
      {showTag()}
      <div className="flex h-full">
        <div className="flex items-center justify-center basis-1/3">
          <img className="h-full" src={image64} alt={imageName} />
        </div>
        <div className="flex flex-col basis-2/3">
          <CardHeader>
            <CardTitle className="group-hover:text-primary">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {stack?.map((stack: TechStackInterface) => {
              return (
                <Badge className="cursor-pointer">
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
          <CardFooter className="gap-4">
            <Button
              className="flex justify-center gap-2 align-center"
              variant={"secondary"}
              size={"sm"}
              onClick={onClickViewDemoHandler}
              disabled={!previewUrl}
            >
              {translate("projects.button.demo")}
              {previewUrl ? (
                <Icon icon="mdi:eye" width="1rem" height="1rem" />
              ) : (
                <Icon icon="mdi:eye-off" width="1rem" height="1rem" />
              )}
            </Button>
            <Button
              className="flex justify-center gap-2 align-center"
              disabled={type === "confidential" || !codeUrl}
              variant={"default"}
              size={"sm"}
              onClick={onClickSourceCodeHandler}
            >
              {translate("projects.button.sourceCode")}
              <Icon icon="entypo:code" width="1rem" height="1rem" />
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};
