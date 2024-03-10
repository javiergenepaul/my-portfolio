import { useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { twMerge } from "tailwind-merge";
import { Label, Switch } from "..";

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
      >
        <div
          className={twMerge(
            "bg-popover z-[999999999999] rounded-lg shadow-lg cursor-grab pointer-events-auto",
            onDrag ? "cursor-grabbing" : ""
          )}
        >
          <div className="p-4 flex flex-col gap-2">
            <div className="Setting">Settings</div>
            <div className="flex items-center gap-2">
              <Switch id="test" />
              <Label htmlFor="test">Show Background Only</Label>
            </div>
          </div>
        </div>
      </Draggable>
    </div>
  );
};
