import { translate } from "@/i18n";
import { ContentTitle } from "@/screens";

export const EducationSection = () => {
  return (
    <section className="basis-1/2">
      <ContentTitle title={translate("about.education.title")} />
    </section>
  );
};
