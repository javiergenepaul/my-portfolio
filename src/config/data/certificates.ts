import moment from "moment";
import { translate } from "@/i18n";
import type { CertificateCardInterface } from "@/config/types";
import { LiloleleIncorporatedOrganization, LinkedInLearningOrganization, UdemyOrganization } from "@/assets";
import { LiloleleBusinessCommunicationCertificate } from "@/assets/certificates";

/**
 * Certificates — shared across all year portfolios.
 * Factory function so translate() runs at render time.
 */
export const getCertificates = (): CertificateCardInterface[] => [
  // ── LinkedIn Learning ──────────────────────────────────────────────────────
  {
    title: "Learning Nuxt.js",
    organization: "LinkedIn Learning",
    organizationImg: LinkedInLearningOrganization,
    organizationAlt: "LinkedIn Learning",
    issuedDate: moment("2025-01"),
    credentialUrl: "https://www.linkedin.com/learning/certificates/75abbbecb5da197538b9da93e8c64ec8a9339637943b009cb7f5e16b43934cea",
  },
  {
    title: "Building Modern Projects with React",
    organization: "LinkedIn Learning",
    organizationImg: LinkedInLearningOrganization,
    organizationAlt: "LinkedIn Learning",
    issuedDate: moment("2025-01"),
    credentialUrl: "https://www.linkedin.com/learning/certificates/5f22c8b207b62b4a95ca289c55b730fe3d14058a55ffda0190567829dd015d37",
  },
  {
    title: "Spring Boot 3 Essential Training",
    organization: "LinkedIn Learning",
    organizationImg: LinkedInLearningOrganization,
    organizationAlt: "LinkedIn Learning",
    issuedDate: moment("2025-01"),
    credentialUrl: "https://www.linkedin.com/learning/certificates/d6ea6ed9472ede216976b6b9836e912b0b57efdb01911594b67572789181da64",
  },
  {
    title: "Microservices Foundations",
    organization: "LinkedIn Learning",
    organizationImg: LinkedInLearningOrganization,
    organizationAlt: "LinkedIn Learning",
    issuedDate: moment("2025-01"),
    credentialUrl: "https://www.linkedin.com/learning/certificates/e1bffa185437fbdead0cd83798aab79500d48a8226bead96f4fa0d97d384d15a",
  },
  {
    title: "Tailwind CSS 4 Essential Training",
    organization: "LinkedIn Learning",
    organizationImg: LinkedInLearningOrganization,
    organizationAlt: "LinkedIn Learning",
    issuedDate: moment("2025-01"),
    credentialUrl: "https://www.linkedin.com/learning/certificates/fa9ef30850fbba9178d4a1916dc7f8b8fd3d07cd9e26512dc43196876dfaa6ca",
  },
  {
    title: "Agile Software Development: Code Quality",
    organization: "LinkedIn Learning",
    organizationImg: LinkedInLearningOrganization,
    organizationAlt: "LinkedIn Learning",
    issuedDate: moment("2025-01"),
    credentialUrl: "https://www.linkedin.com/learning/certificates/95478850cd3efed46794e0df058d2b2c504b942d3e4125634a2c25c27bd89b1d",
  },
  {
    title: "Learning Vue.js",
    organization: "LinkedIn Learning",
    organizationImg: LinkedInLearningOrganization,
    organizationAlt: "LinkedIn Learning",
    issuedDate: moment("2025-01"),
    credentialUrl: "https://www.linkedin.com/learning/certificates/ca8b46dfe316ac85197f5cbef288057391e6eea31d60b267ec24cf7417016705",
  },
  {
    title: "Learning Next.js",
    organization: "LinkedIn Learning",
    organizationImg: LinkedInLearningOrganization,
    organizationAlt: "LinkedIn Learning",
    issuedDate: moment("2025-01"),
    credentialUrl: "https://www.linkedin.com/learning/certificates/92e556b4a71f8e0beac88741807266681c522c4a61b125007dbb1202921b22af",
  },
  {
    title: "Learning TypeScript",
    organization: "LinkedIn Learning",
    organizationImg: LinkedInLearningOrganization,
    organizationAlt: "LinkedIn Learning",
    issuedDate: moment("2025-01"),
    credentialUrl: "https://www.linkedin.com/learning/certificates/c1257ca53d8a512a53e5cc0f03ed0eba75130288acc7ad8a750f381f68278860",
  },
  // ── Udemy ──────────────────────────────────────────────────────────────────
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
