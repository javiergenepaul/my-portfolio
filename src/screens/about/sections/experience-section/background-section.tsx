import { Banner } from "../../components";
import { EducationContent, ExperienceContent } from "./components";

export const BackgroundSection = () => {
  return (
    <div className="relative pb-16">
      <Banner />
      <section className="min-h-screen py-10 flex lg:flex-row flex-col gap-12">
        <ExperienceContent />
        <EducationContent />
      </section>
    </div>
  );
};
