import { TYPE_ROLES } from "@/config";
import { secondsToMilliseconds } from "@/lib";
import { TypeAnimation } from "react-type-animation";

export const SubTitleAnimation = () => {
  return (
    <TypeAnimation
      sequence={TYPE_ROLES.reduce<(string | number)[]>((acc, role, index) => {
        acc.push(role);
        if (index < TYPE_ROLES.length - 1) {
          acc.push(secondsToMilliseconds(2));
        }
        return acc;
      }, [])}
      wrapper="h2"
      speed={50}
      className="mt-3 text-lg font-medium tracking-tight text-slate-200 sm:text-xl"
      repeat={Infinity}
    />
  );
};
