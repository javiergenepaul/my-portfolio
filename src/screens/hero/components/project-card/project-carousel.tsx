import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  Label,
  RadioGroup,
  RadioGroupItem,
} from "@/components";
import { ProjectCarouselInterface } from "@/config";
import { translate } from "@/i18n";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface IProjectCarousel {
  projectId: string;
  carousel: ProjectCarouselInterface[];
  previewUrl: string | undefined;
}

export const ProjectCarousel = ({
  carousel,
  projectId,
  previewUrl,
}: IProjectCarousel) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const onClickPreviewUrl = () => {
    if (previewUrl) {
      window.open(previewUrl, "_blank");
    }
  };

  return (
    <>
      <div className="flex gap-4 flex-col">
        <Carousel
          setApi={setApi}
          className="w-full max-w-screen-md overflow-hidden group"
        >
          <div
            onClick={onClickPreviewUrl}
            className={twMerge(
              "absolute z-50 top-0 left-0 w-full h-full rounded-lg bg-background/30 invisible group-hover:visible",
              previewUrl ? "cursor-pointer" : "cursor-not-allowed"
            )}
          >
            <div className="flex h-full w-full items-center justify-center gap-2">
              {previewUrl ? (
                <>
                  <Eye /> {translate("projects.indicator.viewDemo")}
                </>
              ) : (
                <>
                  <EyeOff /> {translate("projects.indicator.demoUnavailable")}
                </>
              )}
            </div>
          </div>
          <CarouselContent>
            {carousel.map(
              (item: ProjectCarouselInterface, index: React.Key) => {
                return (
                  <CarouselItem key={index}>
                    <img
                      className="rounded-lg aspect-square object-cover"
                      src={item.image}
                      alt={item.name}
                    />
                  </CarouselItem>
                );
              }
            )}
          </CarouselContent>
        </Carousel>
        <div className="w-full">
          <RadioGroup
            onValueChange={(value: string) => {
              if (api) {
                api.scrollTo(parseInt(value) - 1);
              }
            }}
            className="grid grid-cols-5"
            value={current.toString()}
          >
            {carousel.map(
              (item: ProjectCarouselInterface, index: React.Key) => {
                return (
                  <div key={index} className="flex items-center">
                    <RadioGroupItem
                      value={item.value}
                      id={`carousel-option-${projectId}-${item.value}-${index}-${item.name}`}
                      className="sr-only peer"
                    />
                    <Label
                      className="rounded-md border-2 cursor-pointer border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      htmlFor={`carousel-option-${projectId}-${item.value}-${index}-${item.name}`}
                    >
                      <img
                        className="rounded-md"
                        src={item.image}
                        alt={item.name}
                      />
                    </Label>
                  </div>
                );
              }
            )}
          </RadioGroup>
        </div>
      </div>
    </>
  );
};
