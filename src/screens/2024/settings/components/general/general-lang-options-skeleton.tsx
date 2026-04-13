import { Skeleton } from "@/components";

export const GeneralLangOptionsSkeleton = () => {
  return (
    <div className="flex flex-col items-center gap-4 p-4 cursor-wait rounded-md bg-popover">
      <Skeleton className="h-16 w-32 rounded-md" />
      <Skeleton className="h-4 w-1/2 rounded-md" />
    </div>
  );
};
