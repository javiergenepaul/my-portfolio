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
import "moment-duration-format";

interface ContentBodyProps {
  title: string;
  subtitle?: string;
  startYear: Moment;
  endYear: Moment | "present";
  level?: "tertiary" | "secondary" | "primary" | "vocational";
  abbreviation?: string;
  isWork?: boolean;
}

export const ContentBody = (props: ContentBodyProps) => {
  const { title, subtitle, startYear, endYear, abbreviation, level, isWork } =
    props;

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
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="font-bold">{title}</span>
        </CardTitle>
        <CardDescription>
          {subtitle && (
            <div className="font-medium text-foreground">{subtitle}</div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-1 text-nowrap text-xs items-center">
          <span>{startYear.format(isWork ? "MMM YYYY" : "YYYY")}</span>~
          <span>
            {endYear === "present"
              ? "present"
              : endYear.format(isWork ? "MMM YYYY" : "YYYY")}
          </span>\
          {isWork && (
            <>
              <Dot></Dot>
              <div className="">{getYearSpent(startYear, endYear)}</div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
 