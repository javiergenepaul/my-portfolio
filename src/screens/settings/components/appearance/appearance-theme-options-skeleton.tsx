import { Skeleton } from "@/components";

export const AppearanceThemeOptionsSkeleton = () => {
  return (
    <div className="flex flex-col items-center gap-4 p-4 cursor-wait rounded-md bg-popover">
      <Skeleton className="h-20 w-44 rounded-md" />
      <Skeleton className="h-4 w-1/2 rounded-md" />
    </div>
  );
};