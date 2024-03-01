import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components";
import { IndicatorContainer } from "./indicator-container";
import { Code } from "lucide-react";

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
              <p className="group-hover:text-primary">{"Source Code"}</p>
            </IndicatorContainer>
          </TooltipTrigger>
          <TooltipContent>
            <span>{title} - Github Code Available</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  );
};
