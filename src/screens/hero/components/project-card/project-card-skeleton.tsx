import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@/components";

export const ProjectCardSkeleton = () => {
  return (
    <Card className="relative p-0 overfow-hidden cursor-wait">
      <div className="flex flex-col gap-4 px-4 py-6 xl:flex-row md:px-8 h-fit">
        <div className="items-center relative justify-center overflow-hidden rounded-lg select-none md:basis-2/5">
          <Skeleton className="h-full rounded-lg" />
        </div>
        <div className="flex flex-col md:basis-3/5">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="flex items-center gap-4 select-none group-hover:text-primary">
              <Skeleton className="h-6 w-full rounded-lg" />
            </CardTitle>
            <div className="flex gap-2">
              <div className="flex gap-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-lg" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-lg" />
              </div>
            </div>
            <CardDescription className="flex flex-col gap-2 select-none">
              <span className="text-sm font-medium dark:text-white Description">
                <Skeleton className="h-6 w-24 rounded-lg" />
              </span>
              <Skeleton className="h-6 w-full rounded-lg" />
              <Skeleton className="h-6 w-full rounded-lg" />
              <Skeleton className="h-6 w-full rounded-lg" />
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2 px-0 pb-0">
            <Skeleton className="h-6 w-10 rounded-lg" />
            <Skeleton className="h-6 w-10 rounded-lg" />
            <Skeleton className="h-6 w-10 rounded-lg" />
            <Skeleton className="h-6 w-10 rounded-lg" />
            <Skeleton className="h-6 w-10 rounded-lg" />
          </CardContent>
        </div>
      </div>
    </Card>
  );
};
