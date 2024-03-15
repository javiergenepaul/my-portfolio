import {
  Badge,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components";
import { TechStackInterface } from "@/config";
import { StackDetails } from ".";
import { translate } from "@/i18n";

export type StackName = BackEndStack | FrontEndStack | UIStack;
type BackEndStack =
  | "springBoot"
  | "springSecurity"
  | "springSecurityOAuth"
  | "springJDBC"
  | "api"
  | "jwt"
  | "java"
  | "mySQL"
  | "junit"
  | "mockito"
  | "postman"
  | "linux"
  | "azure"
  | "aws"
  | "azurePipelineAgent"
  | "firebase"
  | "git"
  | "nginx"
  | "centOS"
  | "netlify"
  | "heroku"
  | "laravel"
  | "php"
  | "bootstrap"
  | "mvc"
  | "microservices";
type FrontEndStack =
  | "vite"
  | "react"
  | "typescript"
  | "javascript"
  | "html"
  | "css"
  | "jquery"
  | "blade"
  | "tailwind"
  | "shadCn"
  | "mui"
  | "chakraUi"
  | "antDesign"
  | "nextUi"
  | "zustand"
  | "mobx"
  | "chartJs"
  | "gsap"
  | "threeJs"
  | "framerMotion"
  | "jest"
  | "enzyme"
  | "cypress"
  | "i18n"
  | "axios"
  | "reactQuery"
  | "npm"
  | "pnpm"
  | "yarn"
  | "vitest";

type UIStack =
  | "figma"
  | "frontend"
  | "figmaToHTML"
  | "figmaToReact"
  | "attentionToDetails"
  | "pixelPerfect"
  | "landingPage";

export const StackContent = (stack: TechStackInterface) => {
  const { name, url } = stack;

  const onClickBadgeHandler = () => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  const getStackName = (): string => {
    if (name) {
      return translate(`services.stack.${name}`);
    }
    return "";
  };

  return (
    <HoverCard>
      <HoverCardTrigger>
        <Badge className="cursor-pointer" onClick={onClickBadgeHandler}>
          {getStackName()}
        </Badge>
      </HoverCardTrigger>
      <HoverCardContent className="overflow-hidden p-0 m-0 border-0" side="top">
        <StackDetails {...stack} />
      </HoverCardContent>
    </HoverCard>
  );
};
