import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components";
import { Icon } from "@iconify/react/dist/iconify.js";

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
            <Icon
              onClick={onClickCodeHandler}
              className="hover:text-primary"
              icon="entypo:code"
              width="1.2rem"
              height="1.2rem"
            />
          </TooltipTrigger>
          <TooltipContent>  
            <span>{title} - Github Code Available</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  );
};
