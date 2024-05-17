import { EducationSection, ExperienceContent } from "./components";

export const ExperienceSection = () => {
  return (
    <section className="h-screen py-10 flex gap-12">
      <ExperienceContent />
      <EducationSection />
    </section>
  );
};
