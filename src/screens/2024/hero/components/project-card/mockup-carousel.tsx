"use client";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components";
import type { MockupItemInterface } from "@/config";
import { MockupFrame } from "@/components/mockup/mockup-frame";
import { translate } from "@/i18n";
import { logEvent } from "@/lib";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface IMockupCarousel {
  mockups: MockupItemInterface[];
  previewUrl: string | undefined;
}

/**
 * Card image gallery: each mockup screenshot rendered in its frame, swipeable,
 * with dot navigation. Hovering opens the live demo (like ProjectCarousel).
 */
export const MockupCarousel = ({ mockups, previewUrl }: IMockupCarousel) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  const onClickPreviewUrl = () => {
    if (!previewUrl) return;
    logEvent({ category: "Link", action: "Click", label: `${previewUrl} - link` });
    window.open(previewUrl, "_blank");
  };

  return (
    <div className="flex gap-4 flex-col">
      <Carousel
        setApi={setApi}
        className="w-full max-w-3xl overflow-hidden group"
      >
        <div
          onClick={onClickPreviewUrl}
          className={twMerge(
            "absolute z-50 top-0 left-0 w-full h-full rounded-lg bg-background/30 invisible group-hover:visible",
            previewUrl ? "cursor-pointer" : "cursor-not-allowed",
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
          {mockups.map((m, index) => (
            <CarouselItem key={index}>
              {m.template ? (
                <MockupFrame
                  templateId={m.template}
                  screenshot={m.screenshot}
                  alt={`Screenshot ${index + 1}`}
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="rounded-lg aspect-square object-cover w-full"
                  src={m.screenshot}
                  alt={`Screenshot ${index + 1}`}
                  loading="lazy"
                />
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      {mockups.length > 1 && (
        <div className="flex justify-center gap-2">
          {mockups.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to mockup ${index + 1}`}
              className={twMerge(
                "h-2 w-2 rounded-full transition-colors",
                current === index ? "bg-primary" : "bg-muted hover:bg-primary/40",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};
