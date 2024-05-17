import { Moment } from "moment";

interface ContentBodyProps {
  title: string;
  subtitle?: string;
  startYear: Moment;
  endYear: Moment | "present";
  level: "tertiary" | "secondary" | "primary" | "vocational";
  abbreviation: string;
}

export const ContentBody = (props: ContentBodyProps) => {
  const { title, subtitle, startYear, endYear, abbreviation, level } = props;
  return (
    <article className="flex flex-col gap-2 border-b-gray-500">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          {/* title */}
          <div className="flex gap-2">
            <span className="font-bold">{title}</span>
            <div className="font-light">{`(${abbreviation})`}</div>
          </div>

          {/* subtitle */}
          {subtitle && (
            <div className="font-medium text-foreground">{subtitle}</div>
          )}

          {/* level */}
          <div className="font-extralight font-xs capitalize">{level}</div>
        </div>
        {/* year */}
        <div className="flex gap-1">
          <span>{startYear.format("YYYY")}</span>~
          <span>
            {endYear === "present" ? "present" : endYear.format("YYYY")}
          </span>
        </div>
      </div>
    </article>
  );
};
