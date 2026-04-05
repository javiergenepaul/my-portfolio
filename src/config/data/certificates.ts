import moment from "moment";
import { translate } from "@/i18n";
import type { CertificateCardInterface } from "@/config/types";
import { LiloleleIncorporatedOrganization, UdemyOrganization } from "@/assets";
import { LiloleleBusinessCommunicationCertificate } from "@/assets/certificates";

/**
 * Certificates — shared across all year portfolios.
 * Factory function so translate() runs at render time.
 */
export const getCertificates = (): CertificateCardInterface[] => [
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
    organizationAlt: translate("about.certificate.springBoot.organizationAlt"),
    issuedDate: moment("2022-12"),
    credentialId: "UC-02e2602b-ffcc-4457-ab22-4459d0be0ca7",
    credentialUrl:
      "https://udemy-certificate.s3.amazonaws.com/image/UC-02e2602b-ffcc-4457-ab22-4459d0be0ca7.jpg",
  },
  {
    title: translate("about.certificate.businessCommunication.title"),
    organization: translate("about.certificate.businessCommunication.organization"),
    organizationImg: LiloleleIncorporatedOrganization,
    organizationAlt: translate("about.certificate.springBoot.organizationAlt"),
    issuedDate: moment("2024-07"),
    credentialUrl: LiloleleBusinessCommunicationCertificate,
  },
];
