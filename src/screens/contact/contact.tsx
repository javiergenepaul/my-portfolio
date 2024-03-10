import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  FadeAnimation,
} from "@/components";
import { translate } from "@/i18n";
import { ContactLogo } from "@/assets";
import { LogoCanvas } from "./components";
import { ContactForm } from "../hero";

export const Contact = () => {
  return (
    <FadeAnimation>
      <div className="py-10 h-screen pt-0 pb-16 space-y-6 lg:pt-10 ">
        <div className="flex flex-col lg:flex-row gap-24 h-full">
          <Card className="basis-1/2 h-full w-full items-center">
            <CardHeader className="gap-10 pb-10 select-none">
              <img
                src={ContactLogo}
                alt="jav-logo.svg"
                className="w-[74px] h-[74px]"
              />
              <CardTitle>{translate("contact.keepInTouch")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>

          <div className="basis-1/2 w-full flex items-center justify-center">
            <LogoCanvas />
          </div>
        </div>
      </div>
    </FadeAnimation>
  );
};
