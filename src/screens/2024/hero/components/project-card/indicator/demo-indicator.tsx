import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components";
import { translate } from "@/i18n";
import { Eye } from "lucide-react";
import { IndicatorContainer } from "./indicator-container";

interface DemoIndicatorInterface {
  title: string;
  previewUrl: string | undefined;
}

export const DemoIndicator = (props: DemoIndicatorInterface) => {
  const { title, previewUrl } = props;

  const onClickDemoHandler = () => {
    window.open(previewUrl, "_blank");
  };
  return (
    previewUrl && (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <IndicatorContainer>
              <Eye
                className="block hover:text-primary md:hidden"
                onClick={onClickDemoHandler}
                width="1.2rem"
                height="1.2rem"
              />
            </IndicatorContainer>
          </TooltipTrigger>
          <TooltipContent>
            <span>
              {translate("projects.indicator.demoAvailable", { title: title })}
            </span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  );
};
