import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components";
import { translate } from "@/i18n";
import { Clipboard } from "lucide-react";
import { useState } from "react";

interface CopyToClipBoardInterface {
  icon: React.ReactNode;
  content: string;
  clipboardContent: string;
}

export const CopyToClipBoard = ({
  icon,
  content,
  clipboardContent,
}: CopyToClipBoardInterface) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false);
  const [tooltipContent, setTooltipContent] = useState<string>(
    translate("contact.copyToClipboard.default")
  );

  return (
    <div className="flex items-center space-x-2">
      {icon}
      <div className="w-fit relative text-nowrap rounded-md border border-input overflow-hidden bg-background pr-16 px-3 py-2 text-sm select-none">
        {content}
        <TooltipProvider>
          <Tooltip open={isTooltipOpen}>
            <TooltipTrigger asChild>
              <Button
                onMouseEnter={() => setIsTooltipOpen(true)}
                onMouseLeave={() => {
                  setIsTooltipOpen(false);
                  setTimeout(() => {
                    setTooltipContent(
                      translate("contact.copyToClipboard.default")
                    );
                  }, 300);
                }}
                variant="secondary"
                className="absolute rounded-l-8 h-full right-0 top-0 shrink-0 hover:cursor-copy"
                size={"icon"}
                onClick={() => {
                  setIsTooltipOpen(true);
                  setTooltipContent(clipboardContent);
                  navigator.clipboard.writeText(content);
                }}
              >
                <Clipboard />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>{tooltipContent}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
