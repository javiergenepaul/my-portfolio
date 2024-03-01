import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components";
import { IndicatorContainer } from "./indicator-container";
import { Code } from "lucide-react";
import { translate } from "@/i18n";

interface CodeIndicatorInterface {
  title: string;
  codeUrl: string | undefined;
}

export const CodeIndicator = (props: CodeIndicatorInterface) => {
  const { title, codeUrl } = props;

  const onClickCodeHandler = () => {
    window.open(codeUrl, "_blank");
  };

  return (
    codeUrl && (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <IndicatorContainer onClick={onClickCodeHandler}>
              <Code className="group-hover:text-primary" />
              <p className="hidden md:block group-hover:text-primary">
                {translate("projects.indicator.sourceCode")}
              </p>
            </IndicatorContainer>
          </TooltipTrigger>
          <TooltipContent>
            <span>
              {translate("projects.indicator.codeAvaialble", { title: title })}
            </span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  );
};
