import { useNavigate } from "react-router-dom";
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "..";

export interface FloatingNavButtonInterface {
  path: string;
  icon: React.ReactNode;
  name: string;
}

const FloatingNavButton = (props: FloatingNavButtonInterface) => {
  const { path, icon, name } = props;
  const navigate = useNavigate();

  return (
    <li>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button
              onClick={() => navigate(path)}
              size={"icon"}
              variant={"ghost"}
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
