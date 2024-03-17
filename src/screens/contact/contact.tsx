import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  FadeAnimation,
  FloatingNavbar,
} from "@/components";
import { translate } from "@/i18n";
import { LogoCanvas } from "./components";
import { ContactForm } from "../hero";

export const Contact = () => {
  return (
    <FadeAnimation>
      <FloatingNavbar />
      <div className="h-screen py-10 pt-0 pb-16 space-y-6 lg:pt-10 ">
        <div className="flex flex-col h-full gap-24 lg:flex-row">
          <Card className="items-center w-full h-full basis-1/2">
            <CardHeader className="gap-10 pb-10 select-none">
              <CardTitle>{translate("contact.keepInTouch")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>

          <div className="items-center justify-center hidden w-full basis-1/2 lg:flex">
            <LogoCanvas />
          </div>
        </div>
      </div>
    </FadeAnimation>
  );
};
