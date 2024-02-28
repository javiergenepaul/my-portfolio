import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components";
import { TechStackInterface } from "@/config";
import { StackContent } from "./stack-content";
import { ServiceCardInterface } from "./component-props";

export const ServiceCard = (props: ServiceCardInterface) => {
  const { title, description, stack } = props;

  return (
    <Card className="border-transparent select-none bg-white/[5%] backdrop-blur-sm drop-shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-wrap gap-2">
        {stack?.map((stack: TechStackInterface) => {
          return <StackContent {...stack} />;
        })}
      </CardFooter>
    </Card>
  );
};
