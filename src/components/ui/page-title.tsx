import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from ".";

interface PageTitleInterface {
  pageName: string;
  description: string;
  path: string;
}

export const PageTitle = (props: PageTitleInterface) => {
  const { path, pageName, description } = props;
  return (
    <>
      <div className="space-y-0.5">
        <Link
          to={path}
          className="inline-flex items-center mb-2 font-semibold leading-tight text-teal-300 cursor-pointer group"
        >
          {
            <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-2" />
          }
          Paul Javier
        </Link>
        <h1 className="text-4xl font-bold tracking-tight text-slate-200 sm:text-5xl">
          {pageName}
        </h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <Separator className="my-6" />
    </>
  );
};
