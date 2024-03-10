import { useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { twMerge } from "tailwind-merge";

interface Distances {
  [key: string]: number;
  top: number;
  left: number;
  bottom: number;
  right: number;
}

export const FloatingNavigation = () => {
  const [onDrag, setOnDrag] = useState<boolean>(false);
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  const onStartHandler = () => {
    setOnDrag(true);
  };

  const onDragHandler = (_e: DraggableEvent, _data: DraggableData) => {
    // console.log("Dragging", data.x, data.y);
  };

  const onStopHandler = (_e: DraggableEvent, data: DraggableData) => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const elementWidth = data.node.clientWidth;
    const elementHeight = data.node.clientHeight;

    // Define distances with an index signature
    const distances: Distances = {
      top: data.y,
      left: data.x,
      bottom: viewportHeight - (data.y + elementHeight),
      right: viewportWidth - (data.x + elementWidth),
    };
    // Determine the nearest edge
    const nearestEdge = Object.keys(distances).reduce((a, b) =>
      distances[a] < distances[b] ? a : b
    );

    // Calculate new position based on nearest edge
    let newPosition = { x: data.x, y: data.y };
    switch (nearestEdge) {
      case "top":
        newPosition.y = 0;
        break;
      case "left":
        newPosition.x = 0;
        break;
      case "bottom":
        newPosition.y = viewportHeight - elementHeight;
        break;
      case "right":
        newPosition.x = viewportWidth - elementWidth;
        break;
    }
    setPosition(newPosition);
  };

  return (
    <Draggable
      position={position}
      bounds="parent"
      onStart={onStartHandler}
      onDrag={onDragHandler}
      onStop={onStopHandler}
    >
      <div
        className={twMerge(
          "bg-white z-[999999999999] p-4 rounded-lg shadow-lg cursor-grab pointer-events-auto",
          onDrag ? "cursor-grabbing" : ""
        )}
      >
        <h1 className="text-3xl text-black capitalize">test drag me</h1>\
      </div>
    </Draggable>
  );
};
