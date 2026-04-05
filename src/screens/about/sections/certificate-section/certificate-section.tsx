import { getCertificates } from "@/config/data";
import type { CertificateCardInterface } from "@/config/types";
import { Banner } from "../../components";
import { CertificateCard } from "./components/certificate-card";
import React from "react";
import { translate } from "@/i18n";

export const CertificateSection = () => {
  const CERTIFICATES: CertificateCardInterface[] = getCertificates();

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
