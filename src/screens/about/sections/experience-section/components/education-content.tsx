import { translate } from "@/i18n";
import { ContentTitle } from "@/screens";
import { ContentBody } from "@/screens/about/components/content-body";
import moment from "moment";

export const EducationSection = () => {
  return (
    <section className="basis-1/2">
      <ContentTitle title={translate("about.education.title")} />

      <div className="flex flex-col gap-4">
        <ContentBody
          level="tertiary"
          title={"University of Cebu - Main Campus"}
          abbreviation="BSCPE"
          subtitle={"Bachelor of Science of Computer Engineering"}
          startYear={moment("2016")}
          endYear={moment("2021")}
        />
        <ContentBody
          level="vocational"
          title={"Cebu Technological University"}
          abbreviation="OLTEC"
          subtitle={"Opportunity Livelihood Technology Entrepreneurial Classes"}
          startYear={moment("2015")}
          endYear={moment("2016")}
        />
        <ContentBody
          level="secondary"
          title={"Basilan National High School"}
          abbreviation="BNHS"
          startYear={moment("2011")}
          endYear={moment("2015")}
        />
        <ContentBody
          level="primary"
          title={"Isablea Central Elementary Pilot School"}
          abbreviation="ICEPS"
          startYear={moment("2011")}
          endYear={moment("2015")}
        />
      </div>
    </section>
  );
};
