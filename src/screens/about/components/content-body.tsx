import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components";
import { logEvent } from "@/lib";
import { Dot } from "lucide-react";
import moment from "moment";
import { Moment } from "moment";
import { twMerge } from "tailwind-merge";

interface PromotionInterface {
  title: string;
  subtitle: string;
  startYear: Moment;
  endYear: Moment | "present";
  abbreviation?: string;
  description: string;
}

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
  waterMarkWidth?: number;
  promotion?: PromotionInterface[];
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
    waterMarkWidth,
    promotion,
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

    return yearSpentText ? yearSpentText : "1 mos";
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
        logEvent({
          category: "Link",
          action: "Click Experience Card",
          label: `${subtitleUrl} - link`,
        });

        if (subtitleUrl) {
          window.open(subtitleUrl, "_blank");
        }
      }}
    >
      <CardHeader>
        <CardTitle>
          <span className="font-bold text-lg lg:text-2xl">
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
          <span>{startYear.format(isWork ? "MMM YYYY" : "YYYY")}</span>
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
      {promotion && (
        <CardFooter className="flex flex-col border shadow-sm mx-4 mb-4 rounded-lg">
          <ol className="relative space-y-4 border-l mt-4 border-gray-300">
            {promotion.map((prom: PromotionInterface, idx: number) => {
              return (
                <li key={idx} className="ml-6">
                  <span className="flex absolute -left-3.5 justify-center items-center w-7 h-7 bg-blue-200 rounded-full dark:bg-gray-700 dark:text-white text-black">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 256 256"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM40,112H216v48H40ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,72V96H40V72Zm0,128H40V176H216v24Z"></path>
                    </svg>
                  </span>
                  <div className="flex flex-col gap-2">
                    <span className="font-bold text-lg lg:text-l">
                      {prom.title}{" "}
                      {prom.abbreviation && `(${prom.abbreviation})`}
                    </span>
                    {prom.description && (
                      <div className="text-muted-foreground text-sm mb-4">
                        {prom.description}
                      </div>
                    )}
                    <div className="flex gap-1 text-nowrap text-xs items-center">
                      <span>{prom.startYear.format("MMM YYYY")}</span>~
                      <span>
                        {prom.endYear === "present"
                          ? "present"
                          : prom.endYear.format("MMM YYYY")}
                      </span>
                      <Dot />
                      <div className="">
                        {getYearSpent(prom.startYear, prom.endYear)}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </CardFooter>
      )}

      {watermark && (
        <img
          height={"100px"}
          width={waterMarkWidth ? `${waterMarkWidth}px` : "100px"}
          className="absolute top-2 right-2 opacity-30"
          src={watermark as string}
          alt={watermarkAlt}
        />
      )}
    </Card>
  );
};
