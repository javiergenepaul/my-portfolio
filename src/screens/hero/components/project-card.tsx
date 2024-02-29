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
import { PATH, ProjectInterface, TechStackInterface } from "@/config";

interface ProjectCardInterface extends ProjectInterface {}

export const ProjectCard = (props: ProjectCardInterface) => {
  const { title, description, stack, type, url } = props;

  const onClickViewDemoHadndler = () => {
    window.open(url, "_blank");
  };

  const showTag = (): React.ReactNode => {
    switch (type) {
      case "confidential":
        return (
          <div className="absolute right-[-40px] w-40 px-4 py-1 text-xs text-center rotate-45 top-[28px] select-none bg-destructive">
            Confidential
          </div>
        );
      case "personal":
        return (
          <div className="absolute right-[-40px] w-40 px-4 py-1 text-xs text-center rotate-45 top-[28px] select-none bg-primary">
            Personal
          </div>
        );
      case "client":
        return (
          <div className="absolute right-[-40px] w-40 px-4 py-1 text-xs text-center rotate-45 top-[28px] select-none bg-yellow-700">
            Client
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="relative overflow-hidden select-none group">
      {showTag()}
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
          variant={"secondary"}
          size={"sm"}
          onClick={onClickViewDemoHadndler}
        >
          Preview
        </Button>
        <Button
          disabled={type === "confidential" || type === "client"}
          variant={"default"}
          size={"sm"}
        >
          View Code
        </Button>
      </CardFooter>
    </Card>
  );
};
