import { FormControl, FormItem, FormLabel } from "@/components";
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
    <FormItem>
      <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
        <FormControl>
          <RadioGroupItem value={value} className="sr-only" />
        </FormControl>
        <div className="items-center p-1 border-2 rounded-md border-muted bg-popover hover:bg-accent hover:text-accent-foreground">
          {icon}
        </div>
        <span className="block w-full p-2 font-normal text-center">{name}</span>
      </FormLabel>
    </FormItem>
  );
};
