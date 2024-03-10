import { useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { twMerge } from "tailwind-merge";
import { FloatingSettingsContent } from "./floating-settings-content";

export const FloatingNavigation = () => {
  const [onDrag, setOnDrag] = useState<boolean>(false);

  const onStartHandler = () => {
    setOnDrag(true);
  };

  const onDragHandler = (_e: DraggableEvent, _data: DraggableData) => {};

  const onStopHandler = (_e: DraggableEvent, _data: DraggableData) => {
    setOnDrag(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center pointer-events-none">
      <Draggable
        bounds="parent"
        onStart={onStartHandler}
        onDrag={onDragHandler}
        onStop={onStopHandler}
        defaultPosition={{ x: -300, y: 100 }}
      >
        <div
          className={twMerge(
            "bg-popover z-[999999999999] rounded-lg shadow-lg cursor-grab pointer-events-auto opacity-10 hover:opacity-100 transition-opacity duration-300",
            onDrag ? "cursor-grabbing opacity-100" : ""
          )}
        >
          <FloatingSettingsContent />
        </div>
      </Draggable>
    </div>
  );
};
