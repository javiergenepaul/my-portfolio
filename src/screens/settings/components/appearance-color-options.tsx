import { Label, RadioGroupItem } from "@/components";
import { Color } from "@/stores";

export interface AppearanceColorOptionsInterface {
  value: Color;
  name: string;
  color: string;
}

export const AppearanceColorOptions = (
  props: AppearanceColorOptionsInterface
) => {
  const { name, value } = props;
  return (
    <div>
      <RadioGroupItem
        value={value as string}
        id={value}
        className="sr-only peer"
      />
      <Label
        htmlFor={value}
        className="flex gap-4 flex-col items-center justify-between text-center rounded-full border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
      >
        <span className={`text-${value}`}>{name}</span>
      </Label>
    </div>
  );
};
