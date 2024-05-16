import { Moment } from "moment";

interface ContentBodyProps {
  title: string;
  subtitle: string;
  startYear: Moment;
  endYear: Moment | "present";
}

export const ContentBody = (props: ContentBodyProps) => {
  const { title, subtitle, startYear, endYear } = props;
  return (
    <article className="flex flex-col gap-2 border-b-gray-500">
      {title}
      <div className="flex justify-between">
        {/* subtitle */}
        <div className="">{subtitle}</div>
        {/* year */}
        {/* <div className="">{startYear} </div> */}
      </div>
    </article>
  );
};
