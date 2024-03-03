import { Label } from "@/components";

interface InpuptFieldGroupInterface {
  label: string;
  description: string;
  children: React.ReactNode;
  isHidden?: boolean;
}

export const InpuptFieldGroup = (props: InpuptFieldGroupInterface) => {
  const { label, description, children, isHidden } = props;
  return (
    <div className={`${isHidden ? "hidden" : ""}`}>
      <Label>{label}</Label>
      {children}
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
};
