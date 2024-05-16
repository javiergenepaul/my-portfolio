import { EducationSection, ExperienceContent } from "./components";

export const ExperienceSection = () => {
  return (
    <section className="h-screen py-10 bg-red-950 flex">
      <ExperienceContent />
      <EducationSection />
    </section>
  );
};
