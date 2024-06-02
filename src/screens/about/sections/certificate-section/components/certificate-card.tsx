import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components";
import { translate } from "@/i18n";
import { Moment } from "moment";
import { twMerge } from "tailwind-merge";

export interface CertificateCardInterface {
  title: string;
  organization: string;
  organizationImg: string;
  organizationAlt: string;
  issuedDate: Moment;
  credentialId: string;
  credentialUrl: string;
}

export const CertificateCard = (props: CertificateCardInterface) => {
  const {
    title,
    organization,
    credentialUrl,
    issuedDate,
    credentialId,
    organizationImg,
    organizationAlt,
  } = props;
  return (
    <Card
      className={twMerge(
        "",
        credentialUrl
          ? "hover:border hover:border-primary hover:cursor-pointer"
          : ""
      )}
      onClick={() => {
        if (credentialUrl) {
          window.open(credentialUrl, "_blank");
        }
      }}
    >
      <CardHeader>
        <div className="flex gap-2 justify-between">
          <div className="">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{organization}</CardDescription>
            <CardContent className="p-0 mt-2 text-muted-foreground">
              <p className="text-xs">
                {translate("about.certificate.issued", {
                  date: issuedDate.format("MMM YYYY"),
                })}
              </p>
              <p>{credentialId}</p>
            </CardContent>
          </div>
          <img
            className="rounded-lg"
            width={"100px"}
            src={organizationImg}
            alt={organizationAlt}
          />
        </div>
      </CardHeader>
    </Card>
  );
};
