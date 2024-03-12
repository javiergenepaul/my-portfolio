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
import { useEffect, useState } from "react";

interface IProjectCarousel {
  carousel: ProjectCarouselInterface[];
}

export const ProjectCarousel = (props: IProjectCarousel) => {
  const { carousel } = props;

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="flex gap-4 flex-col">
      <Carousel setApi={setApi} className="sw-full max-w-screen-md">
        <CarouselContent>
          {carousel.map((item: ProjectCarouselInterface, index: React.Key) => {
            return (
              <CarouselItem key={index}>
                <img
                  className="rounded-lg aspect-square object-cover"
                  src={item.image}
                  alt={item.name}
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
      <div className="w-full">
        <RadioGroup
          // TODO:: fix the bug
          onValueChange={(value: string) => {
            if (api) {
              api.scrollTo(parseInt(value) - 1);
            }
          }}
          className="grid grid-cols-5"
          value={current.toString()}
        >
          {carousel.map((item: ProjectCarouselInterface, index: React.Key) => {
            return (
              <div key={index} className="flex items-center">
                <RadioGroupItem
                  value={item.value}
                  id={`carousel-option-${item.value}-${index}-${item.name}`}
                  className="sr-only peer"
                />
                <Label
                  className="rounded-md border-2 cursor-pointer border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  htmlFor={`carousel-option-${item.value}-${index}-${item.name}`}
                >
                  <img
                    className="rounded-md"
                    src={item.image}
                    alt={item.name}
                  />
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      </div>
    </div>
  );
};
