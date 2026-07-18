import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components";
import { translate } from "@/i18n";
import { logEvent } from "@/lib";
import { twMerge } from "tailwind-merge";
import type { CertificateCardInterface } from "@/config/types";
export type { CertificateCardInterface } from "@/config/types";

export const CertificateCard = (props: CertificateCardInterface) => {
  const {
    title,
    organization,
    credentialUrl,
    issuedDate,
    organizationImg,
    organizationAlt,
    stack,
  } = props;
  return (
    <Card
      className={twMerge(
        "",
        credentialUrl
          ? "hover:border hover:border-primary hover:cursor-pointer"
          : "",
      )}
      onClick={() => {
        logEvent({
          category: "Link",
          action: "Click Certification Card",
          label: `${credentialUrl} - link`,
        });

        if (credentialUrl) {
          const url =
            typeof credentialUrl === "string"
              ? credentialUrl
              : credentialUrl.src;
          window.open(url, "_blank");
        }
      }}
    >
      <CardHeader>
        <div className="flex gap-2 justify-between">
          <div className="">
            <CardTitle className="line-clamp-2 text-lg font-bold lg:text-2xl">
              {title}
            </CardTitle>
            <CardDescription>{organization}</CardDescription>
            <CardContent className="p-0 mt-2 text-muted-foreground">
              <p className="text-xs">
                {translate("about.certificate.issued", {
                  date: issuedDate.format("MMM YYYY"),
                })}
              </p>
              {/* <p className="hidden md:block">{credentialId}</p> */}
              {stack && stack.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {stack.map((name) => (
                    <span
                      key={name}
                      className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                    >
                      {translate(`services.stack.${name}` as never) || name}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </div>
          <img
            className="rounded-lg"
            width={"100px"}
            src={
              typeof organizationImg === "string"
                ? organizationImg
                : organizationImg.src
            }
            alt={organizationAlt}
          />
        </div>
      </CardHeader>
    </Card>
  );
};
