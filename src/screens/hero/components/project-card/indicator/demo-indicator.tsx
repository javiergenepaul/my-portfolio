import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components";
import { translate } from "@/i18n";
import { Eye } from "lucide-react";

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
            <div className="w-[40px] h-[40px] flex items-center justify-center">
              <Eye
                className="hover:text-primary"
                onClick={onClickDemoHandler}
                width="1.2rem"
                height="1.2rem"
              />
            </div>
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
