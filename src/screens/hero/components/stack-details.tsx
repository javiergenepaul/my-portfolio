import { TechStackInterface } from "@/config";

interface StackDetailsProps extends TechStackInterface {}

export const StackDetails = (props: StackDetailsProps) => {
  const { name, isFavorite, icon } = props;
  return (
    // TODO:: add design for hover card
    <div className="flex flex-col">
      <div>name - {name}</div>
      <div>icon - {icon}</div>
      <div>favorite - {isFavorite ? "true" : "false"}</div>
    </div>
  );
};
