import { Label } from "@/components";

interface InpuptFieldGroupInterface {
  label: string;
  description: string;
  children: React.ReactNode;
}

export const InpuptFieldGroup = (props: InpuptFieldGroupInterface) => {
  const { label, description, children } = props;
  return (
    <div>
      <Label>{label}</Label>
      {children}
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
};
