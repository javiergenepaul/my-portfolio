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
      <CardHeader className="gap-4 px-8 py-6 pb-8 space-y-0">
        <CardTitle>
          <BounceText
            className="font-bold cursor-default select-none"
            text={title}
          />
        </CardTitle>
        <CardDescription className="mt-0 select-none">
          {description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-wrap gap-2 px-8">
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