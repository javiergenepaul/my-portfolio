import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  ScrollArea,
} from "@/components";
import { IndicatorContainer } from "../indicator";
import { CheckCircle, Layers } from "lucide-react";
import { translate } from "@/i18n";
import { KeyContributionInterface } from "@/config";

interface KeyCOntributionModalInterface {
  contributions?: KeyContributionInterface[];
}

export const KeyContributionModal = (props: KeyCOntributionModalInterface) => {
  const { contributions } = props;

  return (
    contributions && (
      <div className="block md:hidden ">
        <Dialog>
          <DialogTrigger asChild>
            <IndicatorContainer>
              <Layers className="group-hover:text-primary" />
              <p className="hidden md:block group-hover:text-primary">
                {translate("projects.indicator.contribution")}
              </p>
            </IndicatorContainer>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {translate("projects.keyContributions")}
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-72 px-4">
              <div className="flex flex-col mt-4 gap-2">
                {contributions.map((contribute: KeyContributionInterface) => {
                  return (
                    <p className="flex gap-2 text-sm text-accent-foreground items-start">
                      <CheckCircle />
                      <div className="">
                        <strong className="font-bold text-nowrap">
                          {contribute.name}
                        </strong>
                        : {contribute.description}
                      </div>
                    </p>
                  );
                })}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    )
  );
};
