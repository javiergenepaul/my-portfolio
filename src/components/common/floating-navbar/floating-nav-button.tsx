"use client";

import { useRouter } from "next/navigation";
import { triggerNavigationStart } from "@/components/common/navigation/NavigationProgress";
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/common/ui";

export interface FloatingNavButtonInterface {
  path: string;
  icon: React.ReactNode;
  name: string;
  onClick?: () => void;
}

const FloatingNavButton = ({
  path,
  icon,
  name,
  onClick,
}: FloatingNavButtonInterface) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      triggerNavigationStart();
      router.push(path);
    }
  };

  return (
    <li>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button onClick={handleClick} size="icon" variant="ghost">
              {icon}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <span>{name}</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </li>
  );
};

export default FloatingNavButton;
