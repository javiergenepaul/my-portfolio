import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components";
import { Dot } from "lucide-react";
import moment from "moment";
import { Moment } from "moment";
import { twMerge } from "tailwind-merge";

export interface ContentBodyInterface {
  title: string;
  subtitle?: string;
  startYear: Moment;
  endYear: Moment | "present";
  level?: "tertiary" | "secondary" | "primary" | "vocational";
  abbreviation?: string;
  isWork?: boolean;
  watermark?: React.ReactNode;
  watermarkAlt?: string;
  description: string;
  subtitleUrl?: string;
}

export const ContentBody = (props: ContentBodyInterface) => {
  const {
    title,
    subtitle,
    startYear,
    endYear,
    abbreviation,
    isWork,
    watermark,
    watermarkAlt,
    description,
    subtitleUrl,
  } = props;

  const getYearSpent = (
    startDate: Moment,
    endDate: Moment | "present"
  ): string => {
    let years;
    let months;

    if (endDate === "present") {
      years = moment().diff(startDate, "years");
      months = moment().diff(startDate, "months");
    } else {
      years = endDate.diff(startDate, "years");
      months = endDate.diff(startDate, "months");
    }

    months = months % 12;

    let yearSpentText: string = "";

    if (years !== 0) {
      yearSpentText = yearSpentText + `${years} ${years > 1 ? "yrs" : "yr"}`;
    }

    if (months !== 0) {
      if (years !== 0) {
        yearSpentText = yearSpentText + " & ";
      }
      yearSpentText = yearSpentText + `${months} ${months > 1 ? "mos" : "mo"}`;
    }

    return yearSpentText;
  };

  return (
    <Card
      className={twMerge(
        "relative",
        subtitleUrl
          ? "hover:border hover:border-primary hover:cursor-pointer"
          : ""
      )}
      onClick={() => {
        if (subtitleUrl) {
          window.open(subtitleUrl, "_blank");
        }
      }}
    >
      <CardHeader>
        <CardTitle>
          <span className="font-bold">
            {title} {abbreviation && `(${abbreviation})`}
          </span>
        </CardTitle>
        <CardDescription className="font-medium text-foreground">
          {subtitle}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {description && (
          <div className="text-muted-foreground text-sm mb-4">
            {description}
          </div>
        )}

        <div className="flex gap-1 text-nowrap text-xs items-center">
          <span>{startYear.format(isWork ? "MMM YYYY" : "YYYY")}</span>~
          <span>
            {endYear === "present"
              ? "present"
              : endYear.format(isWork ? "MMM YYYY" : "YYYY")}
          </span>
          {isWork && (
            <>
              <Dot />
              <div className="">{getYearSpent(startYear, endYear)}</div>
            </>
          )}
        </div>
      </CardContent>
      {watermark && (
        <img
          width={"100px"}
          height={"100px"}
          className="absolute top-2 right-2 opacity-30"
          src={watermark as string}
          alt={watermarkAlt}
        />
      )}
    </Card>
  );
};
