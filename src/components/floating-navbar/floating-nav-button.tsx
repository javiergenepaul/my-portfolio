"use client";

import { useRouter } from "next/navigation";
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui";

export interface FloatingNavButtonInterface {
  path: string;
  icon: React.ReactNode;
  name: string;
}

const FloatingNavButton = ({ path, icon, name }: FloatingNavButtonInterface) => {
  const router = useRouter();

  return (
    <li>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button
              onClick={() => router.push(path)}
              size="icon"
              variant="ghost"
            >
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
