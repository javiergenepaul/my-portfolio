import { Label } from "@/components";
import { LanguageType } from "@/stores";
import { RadioGroupItem } from "@radix-ui/react-radio-group";

export interface GeneralLangOptions {
  value: LanguageType;
  name: string;
  icon: React.ReactNode;
}

export const GeneralLangOption = (props: GeneralLangOptions) => {
  const { value, name, icon } = props;
  return (
    <div>
      <RadioGroupItem value={value} id={value} className="sr-only peer" />
      <Label
        htmlFor={value}
        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
      >
        {icon}
        {name}
      </Label>
    </div>
  );
};
