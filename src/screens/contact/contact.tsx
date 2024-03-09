import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  FadeAnimation,
} from "@/components";
import { translate } from "@/i18n";
import { EarthCanvas } from "./components/canvas/earth-canvas";
import { ContactLogo } from "@/assets";
import { ContactForm } from "../hero/components/contact";

export const Contact = () => {
  return (
    <FadeAnimation>
      <div className="py-10 h-screen  pt-0 pb-16 space-y-6 lg:pt-10 ">
        <div className="flex gap-24 py-8 ">
          <Card className="basis-1/2">
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

          <div className="basis-1/2 flex items-center justify-center">
            <EarthCanvas />
          </div>
        </div>
      </div>
    </FadeAnimation>
  );
};
