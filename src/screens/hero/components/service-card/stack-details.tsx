import moment from "moment";
import { Separator } from "@/components";
import { PROJECTS } from "../../sections";
import { TxKeyPath, translate } from "@/i18n";
import { StackDetailsProps } from "../component-props";
import { BookmarkFilledIcon, BookmarkIcon } from "@radix-ui/react-icons";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";

import "./custom-progress-bar.css";
import "react-circular-progressbar/dist/styles.css";

export const StackDetails = (props: StackDetailsProps) => {
  const {
    name,
    isFavorite,
    icon,
    rate,
    dateStarted,
    dateEnded,
    isStudying,
    alt,
  } = props;
  const stackName: TxKeyPath = `services.stack.${name}` as TxKeyPath;

  /**
   * Calculates the experience in years based on the start and end dates.
   * If still studying, it returns 3 months of experience.
   * If the end date is set to "present", it calculates the experience until the current date.
   * @returns {number} The experience in years.
   */
  const getMonthExperience = (): number => {
    // Get the difference in months between the start date and the current date
    let monthsDiff: number = 0;

    if (isStudying) {
      return 3 / 12;
    }

    if (dateEnded === "present") {
      monthsDiff = moment().diff(dateStarted, "months");
    } else {
      monthsDiff = dateEnded.diff(dateStarted, "months");
    }

    // checking if month diff is 0 for catching error
    if (monthsDiff === 0) {
      return 3 / 12;
    }

    return monthsDiff / 12;
  };

  /**
   * Counts the occurrences of a specific name within the project stack.
   * @param {string} targetName - The name to search for within the project stack.
   * @returns {number} The total count of occurrences of the target name within the project stack.
   */
  const countOccurrences = (targetName: string): number => {
    let count = 0;
    PROJECTS.forEach((project) => {
      if (project.stack) {
        project.stack.forEach((stackItem) => {
          if (stackItem.name === targetName) {
            count++;
          }
        });
      }
    });
    return count;
  };

  return (
    <div className="relative">
      <div className="absolute top-[-14px] right-[-34px] pt-6 pb-1 rotate-45 bg-red-800 w-24 flex justify-center items-center">
        <div className="text-primary -rotate-45">
          {isFavorite ? (
            <BookmarkFilledIcon height={"24px"} width={"24px"} />
          ) : (
            <BookmarkIcon height={"24px"} width={"24px"} />
          )}
        </div>
      </div>
      <div className="flex flex-col p-6 gap-4">
        <div className="text-center font-bold">{translate(stackName)}</div>
        <div className="flex w-full justify-center">
          <CircularProgressbarWithChildren strokeWidth={6} value={rate * 10}>
            <img width={"80px"} src={icon} alt={alt} />
          </CircularProgressbarWithChildren>
        </div>
        <Separator />
        <div className="flex h-5 items-center justify-center space-x-4 text-sm">
          <div className="w-full flex-flex-col justify-center py-2">
            <div className="w-full h-fit text-center">
              <h3>{getMonthExperience().toFixed(1)}</h3>
            </div>
            <div className="w-full text-center text-sm text-muted-foreground">
              {translate("services.hoverCard.years")}
            </div>
          </div>
          <Separator orientation="vertical" />
          <div className="w-full flex-flex-col justify-center py-2">
            <div className="w-full h-fit text-center">
              <h3>{countOccurrences(name)}</h3>
            </div>
            <div className="w-full text-center text-sm text-muted-foreground">
              {translate("services.hoverCard.projects")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
