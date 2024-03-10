import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@/components";

export const ServiceCardSkeleton = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>
          <Skeleton className="h-8 w-1/2 rounded-lg" />
        </CardTitle>
        <CardDescription className="flex flex-col select-none gap-2">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-1/3 rounded-md" />
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-14 rounded-lg" />
        <Skeleton className="h-6 w-14 rounded-lg" />
        <Skeleton className="h-6 w-14 rounded-lg" />
        <Skeleton className="h-6 w-14 rounded-lg" />
        <Skeleton className="h-6 w-14 rounded-lg" />
      </CardFooter>
    </Card>
  );
};
