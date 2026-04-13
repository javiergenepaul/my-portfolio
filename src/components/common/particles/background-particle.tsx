import { StarsCanvas } from "./star-canvas";

export const BackgroundParticle = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center pointer-events-none">
      <StarsCanvas />
    </div>
  );
};
