import { Separator } from "@/components";
import { StackDetailsProps } from "../component-props";
import { TxKeyPath, translate } from "@/i18n";
import { BookmarkFilledIcon, BookmarkIcon } from "@radix-ui/react-icons";
import moment from "moment";

export const StackDetails = (props: StackDetailsProps) => {
  const { name, isFavorite, icon, rate, dateStarted, dateEnded, isStudying } =
    props;
  const stackName: TxKeyPath = `services.stack.${name}` as TxKeyPath;

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

  return (
    // TODO:: add design for hover card
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
          {icon ? (
            <img width={"100px"} src={icon} alt={translate(stackName)} />
          ) : (
            "test"
          )}
        </div>
        <div className="text-center text-sm">{rate} out of 10</div>
        <Separator />
        <div className="flex h-5 items-center justify-center space-x-4 text-sm">
          <div className="w-full flex-flex-col justify-center py-2">
            <div className="w-full h-fit text-center">
              <h3>{getMonthExperience().toFixed(2)}</h3>
            </div>
            <div className="w-full text-center text-sm text-muted-foreground">
              Years
            </div>
          </div>
          <Separator orientation="vertical" />
          <div className="w-full flex-flex-col justify-center py-2">
            <div className="w-full h-fit text-center">
              <h3>1</h3>
            </div>
            <div className="w-full text-center text-sm text-muted-foreground">
              Projects
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
