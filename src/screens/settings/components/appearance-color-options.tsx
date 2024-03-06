import { Label, RadioGroupItem } from "@/components";
import { Color } from "@/stores";

export interface AppearanceColorOptionsInterface {
  value: Color;
  name: string;
  color: string;
  qoutes: string[];
}

export const AppearanceColorOptions = (
  props: AppearanceColorOptionsInterface
) => {
  const { name, value, color } = props;
  return (
    <div>
      <RadioGroupItem
        value={value as string}
        id={value}
        className="sr-only peer"
      />
      <Label
        htmlFor={value}
        className="flex gap-4 flex-col items-center justify-center h-full text-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
      >
        <span className="" style={{ color: color }}>
          {name}
        </span>
      </Label>
    </div>
  );
};
