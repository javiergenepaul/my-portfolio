import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components";
import { Icon } from "@iconify/react/dist/iconify.js";

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
            <Icon
              className="hover:text-primary"
              onClick={onClickDemoHandler}
              icon="icon-park-outline:preview-open"
              width="1rem"
              height="1rem"
            />
          </TooltipTrigger>
          <TooltipContent>
            <span>{title} - Demo Available</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  );
};
