import { Separator } from ".";
import { useTranslation } from "react-i18next";

interface PageTitleInterface {
  pageName: string;
  description: string;
  path: string;
}

export const PageTitle = (props: PageTitleInterface) => {
  const { pageName, description } = props;
  const {} = useTranslation();
  return (
    <>
      <div className="space-y-0.5">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {pageName}
        </h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <Separator className="my-6" />
    </>
  );
};
