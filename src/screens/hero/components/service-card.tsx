import {
  BounceText,
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
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>
          <BounceText className="cursor-default" text={title} />
        </CardTitle>
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
