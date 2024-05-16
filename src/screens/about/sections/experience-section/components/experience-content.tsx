import { translate } from "@/i18n";
import { ContentTitle } from "@/screens";

export const ExperienceContent = () => {
  return (
    <section className="basis-1/2">
      <ContentTitle title={translate("about.experience.title")} />
    </section>
  );
};
