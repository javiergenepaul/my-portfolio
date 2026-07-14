"use client";

import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  FadeAnimation,
  Separator,
} from "@/components";
import { translate } from "@/i18n";
import { CopyToClipBoard } from "./components/copy-to-clipboard";
import { ContactForm } from "../hero";
import { Mail, Phone } from "lucide-react";
import { EMAIL_ADDRESS, MOBILE_NUMBER } from "@/config";

// The 3D logo pulls in the entire Three.js runtime (@react-three/fiber + drei +
// three ≈ 200 kB). It only renders on lg screens, so defer it into its own
// chunk that loads client-side after the page is interactive — keeping it out
// of the route's First Load JS and off mobile entirely.
const LogoCanvas = dynamic(
  () => import("./components/canvas/logo-canvas").then((m) => m.LogoCanvas),
  {
    ssr: false,
    loading: () => <div className="w-full h-70" aria-hidden />,
  },
);

export const Contact = () => {
  const formatPhoneNumber = (number: string): string => {
    const formattedNumber =
      "+63-" +
      number.slice(1, 4) +
      "-" +
      number.slice(4, 7) +
      "-" +
      number.slice(7);

    return formattedNumber;
  };

  return (
    <FadeAnimation>
      <div className="h-screen py-10 pt-0 pb-16 space-y-6 lg:pt-10 ">
        <div className="flex flex-col h-full items-center gap-24 lg:flex-row">
          <Card className="items-center w-full h-fit basis-1/2">
            <CardHeader className="gap-10 pb-10 select-none">
              <div className="flex flex-col gap-2">
                <CardTitle>{translate("contact.keepInTouch")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>
          <div className="items-center justify-center hidden w-full h-full basis-1/2 lg:flex lg:flex-col">
            <LogoCanvas />
            <div className="flex gap-2">
              {/* PHONE */}
              <CopyToClipBoard
                clipboardContent={translate("contact.copyToClipboard.copied")}
                icon={<Phone />}
                content={formatPhoneNumber(MOBILE_NUMBER)}
              />
              {/* Separator */}
              <Separator className="mx-2" orientation="vertical" />
              {/* EMAIL */}
              <CopyToClipBoard
                clipboardContent={translate("contact.copyToClipboard.copied")}
                icon={<Mail />}
                content={EMAIL_ADDRESS}
              />
            </div>
          </div>
        </div>
      </div>
    </FadeAnimation>
  );
};
