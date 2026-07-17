"use client";

import React from "react";
import type { CertificateCardInterface } from "@/config/types";
import { translate, useLocaleRefresh } from "@/i18n";
import { useLanguageStore } from "@/stores/language-store";
import { useContent } from "@/lib/content/use-content";
import { rowsToCertificates } from "@/lib/content/portfolio";
import { Banner } from "../../components";
import { CertificateCard } from "./components/certificate-card";

export const CertificateSection = () => {
  useLocaleRefresh();
  const locale = useLanguageStore((s) => s.language);
  const CERTIFICATES = rowsToCertificates(useContent("certificates"), locale);

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
            },
          )}
        </div>
      </section>
    </section>
  );
};
