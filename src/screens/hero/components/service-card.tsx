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
import React from "react";

export const ServiceCard = (props: ServiceCardInterface) => {
  const { title, description, stack } = props;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>
          <BounceText className="cursor-default select-none" text={title} />
        </CardTitle>
        <CardDescription className="select-none">{description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-wrap gap-2">
        {stack?.map((stack: TechStackInterface, index: React.Key) => {
          return (
            <React.Fragment key={index}>
              <StackContent {...stack} />
            </React.Fragment>
          );
        })}
      </CardFooter>
    </Card>
  );
};
