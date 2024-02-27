import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  Button,
} from "@/components";
import { ServiceOfferInterface, TechStackInterface } from "@/config";
import { useState } from "react";
import { motion } from "framer-motion";
import { translate } from "@/i18n";
import { StackContent } from "./stack-content";

interface ServiceCardInterface extends ServiceOfferInterface {}

export const ServiceCard = (props: ServiceCardInterface) => {
  const { title, description, stack } = props;
  const [showStack, setShowStack] = useState<boolean>(false);

  const toggleVisibility = () => {
    setShowStack(!showStack);
  };

  return (
    <Card className="bg-transparent border-transparent select-none hover:bg-white/[5%] hover:backdrop-blur-sm hover:drop-shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {stack && stack?.length > 10 ? (
        <CardFooter className="flex flex-wrap gap-2">
          <motion.div
            className={"flex flex-wrap gap-x-1.5 gap-y-0.5 items-center"}
            initial={{ opacity: 1 }}
            style={{ display: !showStack ? "" : "flex" }}
            animate={{
              opacity: showStack ? 0 : 1,
              ...(!showStack ? {} : { transitionEnd: { display: "none" } }),
            }}
            transition={{ duration: 0.2 }}
          >
            {stack?.map((stack: TechStackInterface) => {
              return <StackContent {...stack} />;
            })}
          </motion.div>
          <Button className="p-0" variant="link" onClick={toggleVisibility}>
            <small>
              {showStack ? translate("more.show") : translate("more.hide")}
            </small>
          </Button>
        </CardFooter>
      ) : (
        <CardFooter className="flex flex-wrap gap-2">
          {stack?.map((stack: TechStackInterface) => {
            return <StackContent {...stack} />;
          })}
        </CardFooter>
      )}
    </Card>
  );
};
