import { Banner } from "../../components";
import { EducationSection, ExperienceContent } from "./components";

export const ExperienceSection = () => {
  return (
    <div className="relative pb-16">
      <Banner />
      <section className="min-h-screen py-10 flex gap-12">
        <ExperienceContent />
        <EducationSection />
      </section>
    </div>
  );
};
