import { SelectItem } from "@/components";

export interface FontAvailableInterface {
  fontName: string;
  fontClassName: string;
  value: string;
}

export const ApperanceFontOption = (props: FontAvailableInterface) => {
  const { fontName, fontClassName, value } = props;
  return (
    <SelectItem value={value} className={fontClassName}>
      {fontName}
    </SelectItem>
  );
};
