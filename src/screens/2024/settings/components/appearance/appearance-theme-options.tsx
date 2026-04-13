import { Label, RadioGroupItem } from "@/components";
import { Theme } from "@/stores";

export interface ApperanceThemeOptionInterface {
  value: Theme;
  name: string;
  icon: React.ReactNode;
}

const ApperanceThemeOption = (props: ApperanceThemeOptionInterface) => {
  const { value, name, icon } = props;

  return (
    <div>
      <RadioGroupItem
        value={value as string}
        id={value}
        className="sr-only peer"
      />
      <Label
        htmlFor={value}
        className="flex gap-4 flex-col items-center text-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
      >
        {icon}
        {name}
      </Label>
    </div>
  );
};

export default ApperanceThemeOption;
