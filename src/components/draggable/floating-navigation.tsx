import { useEffect, useRef, useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { twMerge } from "tailwind-merge";
import { FloatingSettingsContent } from "./floating-settings-content";
import { useSettingsStore } from "@/stores";

export const FloatingNavigation = () => {
  const { hideFloatingSettings } = useSettingsStore();
  const [onDrag, setOnDrag] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onStartHandler = () => {
    setOnDrag(true);
  };

  const onDragHandler = (_e: DraggableEvent, _data: DraggableData) => {};

  const onStopHandler = (_e: DraggableEvent, _data: DraggableData) => {
    setOnDrag(false);
  };

  const twMergeResult = () => {
    const onDragString: string = onDrag ? "cursor-grabbing opacity-100" : "";
    const onOpenString: string = isOpen ? "opacity-100" : "";

    // Use an array and join method to concatenate with a space delimiter
    return [onDragString, onOpenString].filter(Boolean).join(" ");
  };

  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={twMerge(
        "fixed inset-0 z-50 flex items-center justify-center pointer-events-none",
        hideFloatingSettings ? "hidden" : ""
      )}
    >
      <Draggable
        bounds="parent"
        onStart={onStartHandler}
        onDrag={onDragHandler}
        onStop={onStopHandler}
        defaultPosition={{ x: 0, y: 100 }}
        cancel=".no-drag"
      >
        <div
          className={twMerge(
            "bg-popover border z-[999999999999] rounded-lg shadow-lg cursor-grab pointer-events-auto opacity-50 hover:opacity-100 transition-opacity",
            twMergeResult()
          )}
        >
          <FloatingSettingsContent isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </Draggable>
    </div>
  );
};
