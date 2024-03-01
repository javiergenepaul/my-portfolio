import { TYPE_ROLES } from "@/config";
import { secondsToMilliseconds } from "@/lib";
import { TypeAnimation } from "react-type-animation";

export const SubTitleAnimation = () => {
  return (
    <TypeAnimation
      sequence={TYPE_ROLES.reduce<(string | number)[]>((acc, role) => {
        acc.push(role);
        acc.push(secondsToMilliseconds(3));
        return acc;
      }, [])}
      wrapper="h2"
      speed={50}
      className="mt-3 text-lg font-medium tracking-tight select-none sm:text-xl"
      repeat={Infinity}
    />
  );
};
