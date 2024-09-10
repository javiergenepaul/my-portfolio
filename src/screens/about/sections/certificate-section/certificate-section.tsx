import { LiloleleIncorporatedOrganization, UdemyOrganization } from "@/assets";
import { Banner } from "../../components";
import {
  CertificateCard,
  CertificateCardInterface,
} from "./components/certificate-card";
import moment from "moment";
import React from "react";
import { translate } from "@/i18n";

export const CertificateSection = () => {
  const CERTIFICATES: CertificateCardInterface[] = [
    {
      title: translate("about.certificate.react.title"),
      organization: translate("about.certificate.react.organization"),
      organizationImg: UdemyOrganization,
      organizationAlt: translate("about.certificate.react.organizationAlt"),
      issuedDate: moment("2024-02"),
      credentialId: "UC-b320bafd-2898-4c2e-ae3f-3d72564b8a10",
      credentialUrl:
        "https://udemy-certificate.s3.amazonaws.com/image/UC-b320bafd-2898-4c2e-ae3f-3d72564b8a10.jpg",
    },
    {
      title: translate("about.certificate.springBoot.title"),
      organization: translate("about.certificate.springBoot.organization"),
      organizationImg: UdemyOrganization,
      organizationAlt: translate(
        "about.certificate.springBoot.organizationAlt"
      ),
      issuedDate: moment("2022-12"),
      credentialId: "UC-02e2602b-ffcc-4457-ab22-4459d0be0ca7",
      credentialUrl:
        "https://udemy-certificate.s3.amazonaws.com/image/UC-02e2602b-ffcc-4457-ab22-4459d0be0ca7.jpg",
    },
    {
      title: translate("about.certificate.businessCommunication.title"),
      organization: translate(
        "about.certificate.businessCommunication.organization"
      ),
      organizationImg: LiloleleIncorporatedOrganization,
      organizationAlt: translate(
        "about.certificate.springBoot.organizationAlt"
      ),
      issuedDate: moment("2024-07"),
      credentialUrl:
        "https://media.licdn.com/dms/image/v2/D4E2DAQFjATgOtAAp7Q/profile-treasury-image-shrink_800_800/profile-treasury-image-shrink_800_800/0/1725526351160?e=1726574400&v=beta&t=zzSxGmZ1DExa0xw1lgSuUPt0hbdSkrGTgACUrSf1kFY",
    },
  ];

  return (
    <section className="relative pb-16">
      <Banner />
      <section className="py-10">
        <div className="text-2xl font-bold text-center pb-4">
          {translate("about.certificate.header")}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {CERTIFICATES.map(
            (cert: CertificateCardInterface, index: React.Key) => {
              return <CertificateCard key={index} {...cert} />;
            }
          )}
        </div>
      </section>
    </section>
  );
};
